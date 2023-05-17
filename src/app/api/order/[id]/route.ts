import prisma from "../../../../../prisma/prismadb";
import { NextApiRequest, NextApiResponse } from 'next'

import Stripe from 'stripe'
import { headers } from "next/headers";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function GET(request: Request, { params }: {
    params: { id: string }
}) {
    const { id } = params;
    const order = await prisma.order.findUnique({
        where: {
            id
        },
    });
    return new Response(JSON.stringify(order));
}

export async function PUT(request: Request, { params }: {
    params: { id: string }
}) {
    const headersList = headers();
    const origin = headersList.get('origin');
    const { id } = params;
    const { image_url, top_message, middle_message, bottom_message, recipient_name, recipient_address_line_1, recipient_city, recipient_state, recipient_zip, recipient_country, checkout } = await request.json();
    const order = await prisma.order.update({
        where: {
            id
        },
        data: {
            image_url,
            top_message,
            middle_message,
            bottom_message,
            recipient_name,
            recipient_address_line_1,
            recipient_city,
            recipient_country,
            recipient_state,
            recipient_zip
        },
    });
    if (checkout) {
        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
            mode: "payment",
            client_reference_id: order.id,
            payment_method_types: ['card'],
            line_items: [
            {
                price: process.env.PRICE_ID,
                quantity: 1,
            },
            ],
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
        }
        const checkoutSession: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params)
        if (checkoutSession.url == null || checkoutSession.payment_intent !== null) {
            return new Response("Failed to create checkout session", { status: 500 });
        } else {
            console.log(checkoutSession)
            const order = await prisma.order.update({
                where: {
                    id
                },
                data: {
                    stripe_checkout_session_url: checkoutSession.url
                }
            });
            return new Response(JSON.stringify(order));
        }
    }

    return new Response(JSON.stringify(order));
}