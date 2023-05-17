'use server';
import { Order } from "@prisma/client";
import prisma from "../../prisma/prismadb";

export default async function updateOrder(order: Order, image_url: string) {
    const orderData = await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            image_url: image_url,
        },
    });
    return orderData;
}