"use client";

import { Order } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PromptBuilderSlideover from "./PromptBuilderSlideover";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function GenerateArtwork({ order }: {order: Order | null}) {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(order?.image_url || "");
    const [loading, setLoading] = useState(false);
    const [initiatingOrder, setInitiatingOrder] = useState(false);
    const [promptBuilderOpen, setPromptBuilderOpen] = useState(false);
    const router = useRouter();

    const [generations, setGenerations] = useState<{prompt: string, urls: string[]}[]>([]);

    useEffect(() => {
        const savedGenerations = localStorage.getItem('generations');
        if (savedGenerations !== null) {
            setGenerations(JSON.parse(savedGenerations));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('generations', JSON.stringify(generations));
    }, [generations]);

    async function generateArtwork(promptUsed: string) {
        setLoading(true);
        try {
            const res = await fetch(`/api/generate-images`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: promptUsed }),
            })
        
            if (!res.ok) {
                throw new Error(res.statusText);
            }
        
            // This data is a ReadableStream
            const data = res.body;
            if (!data) {
                return;
            }
        
            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let response = "";
        
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                response += chunkValue;
            }

            const { prompt, urls } = JSON.parse(response);
            if (!prompt || !urls) {
                alert("Sorry, something went wrong with generating your artwork.");
            } else {
                setGenerations([{ prompt, urls }, ...generations])
            }
        } catch (error) {
            alert("We're sorry, we couldn't generate your artwork at this time.");
            console.error(error)
        }
        setLoading(false);
    }

    async function addArtwork() {
        setInitiatingOrder(true);
        if (order !== null) {
            await updateOrder(order);
            setTimeout(() => {
                router.push(`/create/message?order_id=${order.id}`);
            }, 1000);
        } else {
            const order = await initiateOrder();
            router.push(`/create/message?order_id=${order.id}`);
        }
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

    function removeGeneration(index: number) {
        setGenerations(generations.filter((_, i) => i !== index));
    }

    if (initiatingOrder) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="flex flex-col items-center justify-center">
                    Initiating order... 
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-y-0 divide-gray-200">
            <div className="col-span-2 flex flex-col space-y-4 p-6 col-start-1 row-start-2 lg:row-start-1 border-t border-gray-200 lg:border-none">
                <div className="w-full divide-y divide-gray-200 flex flex-col space-y-4">
                    {
                        generations.length > 0 && 
                        generations.map((generation, index) => (
                        <div key={generation.prompt} className="pt-4">
                        <div className="w-full grid grid-cols-4 gap-4">
                        {generation.urls.map((url) => <button onClick={() => setImage(url)} key={url} className={classNames(url == image ? "border-indigo-600": "border-transparent", "rounded-lg overflow-hidden border-2")}>
                            <div className="relative rounded-md bg-gray-200 shadow-inner w-full border border-gray-200 aspect-[1/1] flex items-center justify-center text-center text-sm p-8 text-gray-600 overflow-hidden h-auto">
                                <Image src={url} alt="Generated artwork" width={512} height={512} className="object-cover absolute text-center z-20" />
                                <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-300 animate-pulse z-10" />
                            </div>
                        </button>)}
                        </div>
                        <div className="w-full text-sm font-normal text-gray-400 pt-4 flex justify-between"><div className="flex-1 truncate">{generation.prompt}</div><button onClick={() => removeGeneration(index)} className="text-gray-300 underline hover:text-gray-400 flex-none min-w-0 pl-4">Remove</button></div>
                        </div>
                        ))}
                </div>
            </div>
            <div className="col-span-1 flex flex-col space-y-4 p-6 row-start-1">
            <form onSubmit={(e) => { e.preventDefault(); generateArtwork(prompt); }} className="flex flex-col space-y-4">
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
                {
                    image && !loading &&
                    <button
                        onClick={addArtwork}
                        disabled={!image || loading}
                        type="button"
                        className={classNames((!image || loading) ? "bg-gray-200 text-gray-600 ring-gray-300 ring-1 ring-inset" : "bg-indigo-600 text-white hover:bg-indigo-500", "w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
                    >
                        Continue
                    </button>
                }
            </form>
            </div>

            <PromptBuilderSlideover open={promptBuilderOpen} setOpen={setPromptBuilderOpen} prompt={prompt} setPrompt={setPrompt} />
        </div>
    )
}