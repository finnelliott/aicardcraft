import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import prisma from "../../../../../prisma/prismadb"
import { uuid } from 'uuidv4';
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
            const artwork_id = uuid()
            const artwork_url = `https://uniquegreetings.ams3.digitaloceanspaces.com/${artwork_id}.png`
            const order = await prisma?.order.update({
                where: {
                    id: client_reference_id
                },
                data: {
                    order_history: {
                        push: `Order completed at ${new Date().toLocaleString()}`
                    },
                    paid: true,
                    artwork_url
                }
            })
            fetch(`${process.env.HOST_URL}/api/generate-card-artwork`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order,
                    artwork_id
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