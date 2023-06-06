import AddMessage from "@/components/application/AddMessage";
import AppSteps from "@/components/application/AppSteps";
import prisma from "../../../../prisma/prismadb"
import Link from "next/link";

async function getOrder(order_id: string) {
    const order = await prisma?.order.findUnique({
        where: {
            id: order_id
        }
    });
    return order
}

export default async function Page({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) {
    const { order_id } = searchParams;
    if (!order_id) return (<div>Order not found</div>)
    const order = await getOrder(order_id as string);
    if (!order) return (<div>Order not found</div>)
    if (order.paid) return (<div className="h-96 flex flex-col items-center justify-center"><span>Order already complete.</span><div><Link href={`/order/${order.id}`} className="text-gray-600 underline hover:text-gray-700 mt-2">View details</Link><span>{` or `}</span><Link href={`/craft/image`} className="text-gray-600 underline hover:text-gray-700 mt-2">create a new order.</Link></div></div>)
    return (
        <section>
            <AppSteps order={order} />
            <div className="overflow-hidden sm:rounded-lg bg-gray-50 border-gray-400 bg-opacity-20 border">
            <AddMessage order={order} />
            </div>
        </section>
    )
}