"use client";

import { Order } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PromptBuilderSlideover from "./PromptBuilderSlideover";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function GenerateArtwork({ order }: {order: Order | null}) {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(order?.image_url || "");
    const [loading, setLoading] = useState(false);
    const [initiatingOrder, setInitiatingOrder] = useState(false);
    const [tryAgain, setTryAgain] = useState(false);
    const [promptBuilderOpen, setPromptBuilderOpen] = useState(false);
    const router = useRouter();

    async function generateArtwork() {
        setLoading(true);
        const response = await fetch(`/api/generate-image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        }).then((res) => res.json());
        if (response.error) {
            alert(response.error);
            return;
        }
        setImage(response.image_url);
        setLoading(false);
        setTryAgain(false);
    }

    async function addArtwork() {
        setInitiatingOrder(true);
        if (order !== null) {
            updateOrder(order);
            router.push(`/create/message?order_id=${order.id}`);
        } else {
            const order = await initiateOrder()
            router.push(`/create/message?order_id=${order.id}`);
        }
        setInitiatingOrder(false);
    }

    async function initiateOrder() {
        const order = await fetch(`/api/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                image_url: image
            }),
        }).then((res) => res.json());
        if (order.error) {
            alert(order.error);
            return;
        }
        return order
    }

    async function updateOrder(order: Order) {
        const response = await fetch(`/api/order/${order.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_url: image,
            }),
        }).then((res) => res.json());
        if (response.error) {
            alert(response.error);
            return;
        }
        return order;
    }

    if (initiatingOrder) {
        return (
            <div className="w-full aspect-square flex items-center justify-center">
                <div className="mx-auto text-gray-600 flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <div className="pt-4">
                    Loading...
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col space-y-4">
            {(!image || tryAgain) ? <form onSubmit={(e) => { e.preventDefault(); generateArtwork(); }} className="flex flex-col space-y-4">
                <div>
                    <div>
                        <div className="flex items-center justify-between h-4">
                            <label htmlFor="prompt" className="block text-sm font-medium leading-6 text-gray-900">
                                Prompt
                            </label>
                            <button
                                onClick={() => setPromptBuilderOpen(true)}
                                type="button"
                                className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                            >
                                Open prompt builder
                            </button>
                        </div>
                        <div className="mt-2">
                            <textarea
                            rows={4}
                            name="prompt"
                            id="prompt"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            aria-describedby="prompt-description"
                            />
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500" id="prompt-description">
                        Describe the artwork you want to create. The more descriptive the better.
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading || (prompt == "")}
                    className={classNames(!(loading || (prompt == "")) ? "bg-white text-gray-900 hover:bg-gray-50" : "bg-gray-200 text-gray-600", "w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300")}
                >
                    {!loading ? "Generate artwork" : "Generating artwork..."}
                </button>
            </form> : 
            <button
                type="button"
                onClick={() => setTryAgain(true)}
                disabled={loading}
                className={classNames(!(loading) ? "bg-white text-gray-900 hover:bg-gray-50" : "bg-gray-200 text-gray-600", "w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300")}
            >
                Try another prompt
            </button>
            }
            <div className="py-4 border-y border-gray-200 w-full">
            <div className="rounded-md bg-gray-200 shadow-inner w-full aspect-[1/1] flex items-center justify-center p-8 text-gray-600 relative overflow-hidden h-auto">
                {image && <Image src={image} alt="Generated artwork" width={592} height={592} className="object-cover absolute" />}
                Your generated artwork will appear here.
            </div>
            </div>
            <button
                    onClick={addArtwork}
                    disabled={!image}
                    type="button"
                    className={classNames(!image ? "bg-gray-200 text-gray-600 ring-gray-300 ring-1 ring-inset" : "bg-indigo-600 text-white hover:bg-indigo-500", "w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
                >
                    Continue
            </button>

            <PromptBuilderSlideover open={promptBuilderOpen} setOpen={setPromptBuilderOpen} prompt={prompt} setPrompt={setPrompt} />
        </div>
    )
}