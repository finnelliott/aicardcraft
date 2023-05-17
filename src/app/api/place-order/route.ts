export async function POST(request: Request) {
  if (!process.env.PRODIGI_API_KEY) {
    return new Response('No API key set', { status: 500 })
  }
  const { line1, line2, postalOrZipCode, countryCode, townOrCity, stateOrCounty, name, email, sku, copies, url } = await request.json()
  if (!line1) {
    return new Response('No line1 set', { status: 500 })
  }
  if (!line2) {
    return new Response('No line2 set', { status: 500 })
  }
  if (!postalOrZipCode) {
    return new Response('No postalOrZipCode set', { status: 500 })
  }
  if (!countryCode) {
    return new Response('No countryCode set', { status: 500 })
  }
  if (!townOrCity) {
    return new Response('No townOrCity set', { status: 500 })
  }
  if (!stateOrCounty) {
    return new Response('No stateOrCounty set', { status: 500 })
  }
  if (!name) {
    return new Response('No name set', { status: 500 })
  }
  if (!email) {
    return new Response('No email set', { status: 500 })
  }
  if (!url) {
    return new Response('No url set', { status: 500 })
  }

  const order = await fetch("https://api.sandbox.prodigi.com/v4.0/Orders", {
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
              "line2": line2,
              "postalOrZipCode": postalOrZipCode,
              "countryCode": countryCode,
              "townOrCity": townOrCity,
              "stateOrCounty": stateOrCounty
          },
          "name": name,
          "email": email
      },
      "items": [
          {
              "sku": sku || "GLOBAL-GRE-GLOS-6X6-DIR",
              "copies": copies || 1,
              "sizing": "fillPrintArea",
              "assets": [
                  {
                      "printArea": "default",
                      "url": "https://your-image-url/image.png"
                  }
              ]
          }
      ]
    })
  }).then(res => res.json())
  if (order.outcome !== "Created") {
    return new Response(JSON.stringify(order), { status: 500 })
  }

  return new Response(JSON.stringify(order.order))
}
