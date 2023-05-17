import AppSteps from "@/components/application/AppSteps";
import CardHeading from "@/components/application/CardHeading";
import CardWithHeader from "@/components/application/CardWithHeader";
import GenerateArtwork from "@/components/application/GenerateArtwork";
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
    const order = order_id ? await getOrder(order_id as string) : null;
    return (
        <section>
            <AppSteps order={order} />
            <CardWithHeader header={<CardHeading heading={"Generate artwork"} />} body={<GenerateArtwork order={order} />} />
        </section>
    )
}