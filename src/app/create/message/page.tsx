import AddMessage from "@/components/application/AddMessage";
import AppSteps from "@/components/application/AppSteps";
import prisma from "../../../../prisma/prismadb"

async function getOrder(order_id: string) {
    const res = await fetch(`http://localhost:3000/api/order/${order_id}`,{ next: { tags: ['order'] } })
    const order = await res.json()
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
    return (
        <section>
            <AppSteps order={order} />
            <div className="overflow-hidden sm:rounded-lg bg-gray-50 border-gray-200 border">
            <AddMessage order={order} />
            </div>
        </section>
    )
}