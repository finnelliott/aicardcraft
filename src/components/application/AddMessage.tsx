"use client";
import { Order } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function AddMessage({ order }: { order: Order }) {
    const router = useRouter()
    const [ topMessage, setTopMessage ] = useState(order.top_message || "")
    const [ middleMessage, setMiddleMessage ] = useState(order.middle_message || "")
    const [ bottomMessage, setBottomMessage ] = useState(order.bottom_message || "")
    async function handleSubmit() {
        const response = await fetch(`/api/order/${order.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                top_message: topMessage,
                middle_message: middleMessage,
                bottom_message: bottomMessage,
            }),
        }).then((res) => res.json());
        if (response.error) {
            alert(response.error);
            return;
        }
        router.push(`/create/recipient?order_id=${response.id}`)
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-y-0 divide-x-0 divide-y divide-gray-200">
        <div className="col-span-1 p-6 flex flex-col sm:flex-row lg:flex-col justify-start">
            <label htmlFor="front-preview" className="block text-sm font-medium leading-6 text-gray-900 mb-2 w-56">
                Preview of front
            </label>
            <div id="front-preview" className="max-w-sm max-h-[384px] rounded-md bg-gray-200 border border-gray-200 shadow-inner w-full aspect-[1/1] flex items-center justify-center text-gray-600 relative overflow-hidden h-auto">
                <Image src={order.image_url} priority={false} alt="Generated artwork" width={512} height={512} className="object-cover absolute" />
            </div>
        </div>
        <div className="col-span-1 p-6 flex flex-col sm:flex-row lg:flex-col justify-start">
            <label htmlFor="inside-preview" className="block text-sm font-medium leading-6 text-gray-900 mb-2 w-56">
                Preview of inside
            </label>
            <div id="inside-preview" className="max-w-sm max-h-[384px] rounded-md bg-gray-200 border border-gray-200 shadow-inner w-full aspect-[1/1] flex items-center justify-center text-gray-600 relative overflow-hidden h-auto">
                <div id="inside-back" className="flex flex-col justify-between items-center scale-5 bg-white w-full h-full p-10 text-xs max-w-sm max-h-[384px]">
                    {topMessage || middleMessage || bottomMessage ? (
                        <>
                        <div id="top-message">{topMessage}</div>
                        <div id="middle-message" className="text-sm text-center whitespace-break-spaces">{middleMessage}</div>
                        <div id="bottom-message">{bottomMessage}</div>
                        </>
                    ) : (
                        <>
                        <div id="top-message" className="p-2 bg-indigo-50 text-indigo-600 -mt-2 rounded-md">Top message</div>
                        <div id="middle-message" className="text-sm text-center whitespace-break-spaces p-2 bg-indigo-50 text-indigo-600 rounded-md">Middle message</div>
                        <div id="bottom-message"className="p-2 bg-indigo-50 text-indigo-600 -mb-2 rounded-md">Bottom message</div>
                        </>
                    )}
                </div>
            </div>
        </div>
        <form className="flex flex-col space-y-4 p-6 col-span-1" onSubmit={(e) => {e.preventDefault();handleSubmit()}}>
            <div>
                <label htmlFor="top-message" className="block text-sm font-medium leading-6 text-gray-900">
                    Top
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="top-message"
                    id="top-message"
                    value={topMessage}
                    onChange={(e) => setTopMessage(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="To Johnny"
                    />
                </div>
            </div>
            <div>
                <div>
                    <label htmlFor="middle-message" className="block text-sm font-medium leading-6 text-gray-900">
                        Middle
                    </label>
                    <div className="mt-2">
                        <textarea
                        rows={4}
                        name="middle-message"
                        id="middle-message"
                        value={middleMessage}
                        onChange={(e) => setMiddleMessage(e.target.value)}
                        placeholder="Happy Birthday!"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        aria-describedby="middle-message-description"
                        />
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="bottom-message" className="block text-sm font-medium leading-6 text-gray-900">
                    Bottom
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="bottom-message"
                    id="bottom-message"
                    value={bottomMessage}
                    onChange={(e) => setBottomMessage(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Love, Jinny x"
                    />
                </div>
            </div>
            <div className="pt-4 border-t border-gray-200 w-full">
            <button
                    disabled={!topMessage || !middleMessage || !bottomMessage}
                    type="submit"
                    className={classNames((!topMessage || !middleMessage || !bottomMessage) ? "bg-gray-200 text-gray-600 ring-gray-300 ring-1 ring-inset" : "bg-indigo-600 text-white hover:bg-indigo-500", "w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
                >
                    Continue
            </button>
            </div>
        </form>
        </div>
    )
}