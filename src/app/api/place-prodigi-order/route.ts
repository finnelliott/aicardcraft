export async function POST(request: Request) {
    const { order } = await request.json();
    const { id, line1, postalOrZipCode, countryCode, townOrCity, stateOrCounty, name, artwork_url } = order;
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