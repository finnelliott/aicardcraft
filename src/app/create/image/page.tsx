import AppSteps from "@/components/application/AppSteps";
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

export const revalidate = 0;

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
            <div className="overflow-hidden sm:rounded-lg bg-gray-50 border-gray-200 border">
            <GenerateArtwork order={order} />
            </div>
        </section>
    )
}