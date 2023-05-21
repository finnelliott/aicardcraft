import { Order } from "@prisma/client";
import prisma from "../../../../prisma/prismadb";

export async function POST(request: Request) {
    const { order } = await request.json();
    const { artwork_url, id, recipient_address_line_1, recipient_city, recipient_country, recipient_state, recipient_zip, recipient_name } = order as Order;
    const prodigiOrder = await fetch(process.env.NODE_ENV == "production" ? "https://api.prodigi.com/v4.0/Orders" : "https://api.sandbox.prodigi.com/v4.0/Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.PRODIGI_API_KEY as string,
        },
        body: JSON.stringify({
            "shippingMethod": "Budget",
            "recipient": {
                "address": {
                    "line1": recipient_address_line_1,
                    "postalOrZipCode": recipient_zip,
                    "countryCode": recipient_country,
                    "townOrCity": recipient_city,
                    "stateOrCounty": recipient_state
                },
                "name": recipient_name,
            },
            "items": [
                {
                    "sku": "GLOBAL-GRE-GLOS-6X6-DIR",
                    "copies": 1,
                    "sizing": "fillPrintArea",
                    "assets": [
                        {
                            "printArea": "default",
                            "url": artwork_url
                        }
                    ]
                }
            ]
    })}).then(res => res.json())
    console.log(prodigiOrder);
    await prisma?.order.update({
        where: {
            id: id
        },
        data: {
            prodigi_order_id: prodigiOrder.order.id,
            prodigi_order_status: prodigiOrder.order.status.stage,
        }
    });
    return new Response("Done");
}