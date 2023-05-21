import Link from "next/link";
import prisma from "../../../../prisma/prismadb"
import Image from "next/image";
import OrderIncomplete from "@/components/application/OrderIncomplete";

async function getOrder(order_id: string) {
    const order = await prisma?.order.findUnique({
        where: {
            id: order_id
        },
    });
    return order
}

export default async function Page({
    params,
    searchParams,
  }: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }) {
    const { id } = params;
    if (!id) return (<div>Order not found</div>)
    const order = await getOrder(id);
    if (!order) return (<div>Order not found</div>)
    if (!order.paid) return <OrderIncomplete order={order} />
    return (
        <main>
            <div className="w-full h-full bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto p-4 pb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Thank you for your order!</h1>
                </div>
                <div className="w-full max-w-3xl mx-auto sm:p-4">
                    <div className="divide-y divide-gray-200 overflow-hidden sm:rounded-lg bg-white shadow">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="text-lg leading-6 font-medium text-gray-900">
                                Order #{order.id.slice(0,5)}
                            </div>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Created on {order.created_at.toLocaleString()}
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-lg leading-6 font-medium text-gray-900">
                                Order details
                            </div>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>
                                    <span className="font-medium text-gray-900">Product:</span> {` `}
                                    <span className="text-gray-600">Custom Greetings Card</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Size:</span> {` `}
                                    <span className="text-gray-600">5.5&quot;x5.5&quot;</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Price:</span> {` `}
                                    <span className="text-gray-600">£3.50 (shipping included)</span>
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-lg leading-6 font-medium text-gray-900">
                                Shipping address
                            </div>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>
                                    <span className="font-medium text-gray-900">Name:</span> {` `}
                                    <span className="text-gray-600">{order.recipient_name}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Address:</span> {` `}
                                    <span className="text-gray-600">{order.recipient_address_line_1}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">City:</span> {` `}
                                    <span className="text-gray-600">{order.recipient_city}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Region:</span> {` `}
                                    <span className="text-gray-600">{order.recipient_state}</span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Postal code:</span> {` `}
                                    <span className="text-gray-600">{order.recipient_zip}</span>
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-lg leading-6 font-medium text-gray-900 pb-4">
                                Order history
                            </div>
                            <div className="mt-2 max-w-xl text-sm text-gray-500 divide-y divide-gray-200">
                               {order.order_history.map((history, index) => (
                                <div key={index} className="py-2">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-sm text-gray-500">
                                            {history}
                                        </p>
                                    </div>
                                </div>
                            </div>))}
                            </div>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="text-lg leading-6 font-medium text-gray-900 pb-4">
                                Artwork
                            </div>
                            <div className="pt-6 flex flex-col sm:flex-row lg:flex-col justify-start">
                                <label htmlFor="front-preview" className="block text-sm font-medium leading-6 text-gray-900 mb-2 w-56">
                                    Front
                                </label>
                                <div id="front-preview" className="max-w-sm max-h-[384px] rounded-md bg-gray-200 border border-gray-200 shadow-inner w-full aspect-[1/1] flex items-center justify-center text-gray-600 relative overflow-hidden h-auto">
                                    <Image src={order.image_url} priority={false} alt="Generated artwork" width={512} height={512} className="object-cover absolute" />
                                </div>
                            </div>
                            <div className="py-6 flex flex-col sm:flex-row lg:flex-col justify-start">
                                <label htmlFor="inside-preview" className="block text-sm font-medium leading-6 text-gray-900 mb-2 w-56">
                                    Inside
                                </label>
                                <div id="inside-preview" className="max-w-sm max-h-[384px] rounded-md bg-gray-200 border border-gray-200 shadow-inner w-full aspect-[1/1] flex items-center justify-center text-gray-600 relative overflow-hidden h-auto">
                                    <div id="inside-back" className="flex flex-col justify-between items-center scale-5 bg-white w-full h-full p-10 text-xs max-w-sm max-h-[384px]">
                                        <div id="top-message">{order.top_message}</div>
                                        <div id="middle-message" className="text-sm text-center whitespace-break-spaces">{order.middle_message}</div>
                                        <div id="bottom-message">{order.bottom_message}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}