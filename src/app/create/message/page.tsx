import AddMessage from "@/components/application/AddMessage";
import AppSteps from "@/components/application/AppSteps";
import CardHeading from "@/components/application/CardHeading";
import CardWithHeader from "@/components/application/CardWithHeader";
import prisma from "../../../../prisma/prismadb"

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
    return (
        <section>
            <AppSteps order={order} />
            <CardWithHeader header={<CardHeading heading={"Add message"} />} body={<AddMessage order={order} />} />
        </section>
    )
}