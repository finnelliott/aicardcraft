import { Order } from "@prisma/client";

export async function POST(request: Request) {
    const { order } = await request.json();
    const { id, recipient_address_line_1: line1, recipient_zip: postalOrZipCode, recipient_country: countryCode, recipient_city: townOrCity, recipient_state: stateOrCounty, recipient_name: name, artwork_url } = order as Order;
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
                    "line1": line1,
                    "postalOrZipCode": postalOrZipCode,
                    "countryCode": countryCode,
                    "townOrCity": townOrCity,
                    "stateOrCounty": stateOrCounty
                },
                "name": name
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