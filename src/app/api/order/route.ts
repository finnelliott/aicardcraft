import prisma from "../../../../prisma/prismadb";

export async function POST(request: Request) {
    const { image_url } = await request.json();
    if (!image_url) {
        return new Response("No image_url set", { status: 500 });
    }
    const user = await prisma.user.create({
        data: {}
    })
    const order = await prisma.order.create({
        data: {
            image_url,
            user_id: user.id
        },
    });
    return new Response(JSON.stringify(order));
}