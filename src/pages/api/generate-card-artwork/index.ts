import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import axios from 'axios';
import FormData from 'form-data';

const engineId = 'stable-diffusion-x4-latent-upscaler'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) throw new Error('Missing Stability API key.')

async function generateImage(htmlContent: string) {
    
    const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
    })
    const page = await browser.newPage();
  
    await page.setContent(htmlContent);
    await page.setViewport({ width: 6732, height: 1712 });
  
    const imageBuffer = await page.screenshot({ type: 'png' });
  
    await browser.close();
  
    return imageBuffer;
}

const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DIGITALOCEAN_SECRET_ID,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET
});

async function uploadToDigitalOcean(imageBuffer: Buffer, id: string) {
    try {
        const uploadParams = {
            Bucket: 'uniquegreetings',
            Key: id + ".png",
            Body: imageBuffer,
            ContentType: 'image/png',
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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { order, artwork_id } = req.body;
    const formData = new FormData()
    const response = await axios.get(order.image_url, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(response.data, 'binary');
    formData.append('image', imageBuffer)
    formData.append('width', "1792")
    const { data } = await axios(
        `${apiHost}/v1/generation/${engineId}/image-to-image/upscale`,
        {
          method: 'POST',
          headers: {
            ...formData.getHeaders(),
            Accept: 'image/png',
            Authorization: `Bearer ${apiKey}`,
          },
          data: formData,
          responseType: 'arraybuffer'
        }
    )
    const image_url_upscaled = await fetchAndUpload(data);
    console.log("Upscaled URL: ", image_url_upscaled)
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.4.1/dist/typography.min.css" rel="stylesheet" />
    </head>
    <body class="bg-white flex w-screen h-screesn" style="">
        <div id="outer-rear" style="width: 1683px; height: 1712px;"></div>
        <img id="outer-front" src="${"https://"+image_url_upscaled}" style="width: 1683px; height: 1712px; object-fit: cover;" />
        <div style=""></div>
        <div id="inside-front" style="width: 1683px; height: 1712px;"></div>
        <div id="inside-back" class="flex flex-col justify-between items-center" style="width: 1683px; height: 1712px; padding-left: 225px; padding-top: 250px; padding-bottom:250px; padding-right:250px; font-size: 48px; text-align: center;">
            <div id="top-message" class="text-center">${order.top_message}</div>
            <div id="middle-message" style="font-size: 64px;" class="text-center whitespace-break-spaces">${order.middle_message}</div>
            <div id="bottom-message" class="text-center">${order.bottom_message}</div>
        </div>
    </body>
    </html>
    `
    await generateImage(htmlContent).then(async (imageBuffer) => {
        await uploadToDigitalOcean(imageBuffer, artwork_id).then((url) => {
            return;
        });
        return;
    });
    await fetch(`${process.env.HOST_URL}/api/place-prodigi-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            order
        }),
    })
    return res.status(200).json({ success: true });
}