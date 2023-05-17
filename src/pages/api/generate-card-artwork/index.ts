import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import axios from 'axios';
import AWS from 'aws-sdk';

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
    accessKeyId: process.env.DO_SECRET_ID,
    secretAccessKey: process.env.DO_SECRET
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
    const { htmlContent, id } = req.body;
    const artwork_url = await generateImage(htmlContent).then(async (imageBuffer) => {
        const url = await uploadToDigitalOcean(imageBuffer, id).then((url) => {
            return url;
        });
        return url
    });
    return res.status(200).json({ artwork_url });
}