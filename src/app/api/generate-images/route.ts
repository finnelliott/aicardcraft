import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuid } from 'uuid';
import FormData from "form-data";
import AWS from 'aws-sdk';

const engineId = 'stable-diffusion-512-v2-1'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) throw new Error('Missing Stability API key.')

export async function POST(request: Request) {
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

    const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DO_SECRET_ID,
        secretAccessKey: process.env.DO_SECRET
    });

    async function fetchAndUpload(base64img: string) {
      try {

          const uploadParams = {
              Bucket: 'uniquegreetings',
              Key: uuid() + ".png",
              Body: Buffer.from(base64img, 'base64'),
              ContentType: "image/png",
              ACL: 'public-read' // Optional: Set this if you want the file to be publicly accessible
          };
  
          const data = await s3.upload(uploadParams).promise();

          console.log(data)

          return data["Location"]
      } catch (error) {
          console.error('Error fetching or uploading the file:', error);
          throw error;
      }
    }
  
    let urls = [];
    for (const artifact of responseJSON.artifacts) {
      const url = await fetchAndUpload(artifact.base64);
      urls.push(url);
    }

    return new Response(JSON.stringify({
      prompt,
      urls
    }));
}