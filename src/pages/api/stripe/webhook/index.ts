import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from "../../../../../prisma/prismadb"
import { uuid } from 'uuidv4';
import axios from 'axios';
import FormData from 'form-data';
import AWS from 'aws-sdk';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const spacesEndpoint = new AWS.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DIGITALOCEAN_SECRET_ID,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET
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


const engineId = 'stable-diffusion-x4-latent-upscaler'
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

if (!apiKey) throw new Error('Missing Stability API key.')

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const reqBuffer = await buffer(req);
    const payload = reqBuffer.toString('utf-8');
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        console.error('⚠️ Webhook error missing stripe-signature');
        return res.status(400).send('Webhook Error: Missing stripe-signature');
    }
    let event;
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('Missing Stripe webhook secret');
    }
    try {
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSession = event.data.object;
            // @ts-ignore
            const client_reference_id = checkoutSession.client_reference_id;
            const order = await prisma?.order.update({
                where: {
                    id: client_reference_id
                },
                data: {
                    order_history: {
                        push: `Order completed at ${new Date().toLocaleString()}`
                    },
                    paid: true
                }
            })
            if (!process.env.PRODIGI_API_KEY) {
                return res.status(500).send('No prodigi api key set')
            }
            const { recipient_address_line_1: line1, recipient_zip: postalOrZipCode, recipient_country: countryCode, recipient_city: townOrCity, recipient_state: stateOrCounty, recipient_name: name, image_url } = order
            if (!line1) {
                return res.status(500).send('No line1 set')
            }
            if (!postalOrZipCode) {
                return res.status(500).send('No postalOrZipCode set')
            }
            if (!countryCode) {
                return res.status(500).send('No countryCode set')
            }
            if (!townOrCity) {
                return res.status(500).send('No townOrCity set')
            }
            if (!stateOrCounty) {
                return res.status(500).send('No stateOrCounty set')
            }
            if (!name) {
                return res.status(500).send('No name set')
            }
            if (!image_url) {
                return res.status(500).send('No image_url set')
            }
            const formData = new FormData()
            const response = await axios.get(image_url, { responseType: 'arraybuffer' })
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
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.4.1/dist/typography.min.css" rel="stylesheet" />
            </head>
            <body class="bg-white flex w-screen h-screen" style="">
                <div id="outer-rear" style="width: 1683px; height: 1712px;"></div>
                <img id="outer-front" src="${image_url_upscaled}" style="width: 1683px; height: 1712px; object-fit: cover;" />
                <div style=""></div>
                <div id="inside-front" style="width: 1683px; height: 1712px;"></div>
                <div id="inside-back" class="flex flex-col justify-between items-center" style="width: 1683px; height: 1712px; padding-left: 225px; padding-top: 250px; padding-bottom:250px; padding-right:250px; font-size: 48px; text-align: center;">
                    <div id="top-message">${order.top_message}</div>
                    <div id="middle-message" style="font-size: 64px;" class="text-center whitespace-break-spaces">${order.middle_message}</div>
                    <div id="bottom-message">${order.bottom_message}</div>
                </div>
            </body>
            </html>
            `
            const artwork_id = uuid()
            const artwork_url = `https://uniquegreetings.ams3.digitaloceanspaces.com/${artwork_id}.png`
            fetch(`${process.env.HOST_URL}/api/generate-card-artwork`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: artwork_id,
                    htmlContent
                })
            })
            fetch(`${process.env.HOST_URL}/api/place-prodigi-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_reference_id, line1, postalOrZipCode, countryCode, townOrCity, stateOrCounty, name, artwork_url
                })
            })
            break;
        default:
            console.error(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default webhookHandler;