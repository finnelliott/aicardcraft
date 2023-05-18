const engineId = 'stable-diffusion-512-v2-1'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) throw new Error('Missing Stability API key.')

export const runtime = "edge";

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
 
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

const encoder = new TextEncoder();

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function* makeIterator(data: { prompt: string, urls: string[]}) {
  yield encoder.encode(JSON.stringify(data));
}

export async function POST(request: Request): Promise<Response> {
    const { prompt } = await request.json();
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: 'ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy',
              weight: -1
            },
            {
              text: 'tiling',
              weight: -1
            }
          ],
          cfg_scale: 7,
          clip_guidance_preset: 'FAST_BLUE',
          height: 512,
          width: 512,
          samples: 4,
          steps: 50,
        }),
      }
    )
    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`)
    }

    interface GenerationResponse {
      artifacts: Array<{
        base64: string
        seed: number
        finishReason: string
      }>
    }
    
    const responseJSON = (await response.json()) as GenerationResponse
  
    let urls = [];
    for (const artifact of responseJSON.artifacts) {
      const {url} = await fetch(process.env.HOST_URL + `/api/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base64img: artifact.base64,
        }),
      }).then((res) => res.json());
      urls.push(url);
    }

    const iterator = makeIterator({ prompt, urls });
    const stream = iteratorToStream(iterator);
    return new Response(stream);
}