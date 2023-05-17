"use client";
import { Order } from "@prisma/client";
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
        <form className="flex flex-col space-y-4" onSubmit={(e) => {e.preventDefault();handleSubmit()}}>
            <div>
                <label htmlFor="top-message" className="block text-sm font-medium leading-6 text-gray-900">
                    Top message
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
                        Middle message
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
                    Bottom message
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
    )
}