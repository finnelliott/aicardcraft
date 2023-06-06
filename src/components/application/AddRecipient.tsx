"use client";
import { Order } from "@prisma/client";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function AddRecipient({ order }: { order: Order }) {
    const router = useRouter()
    const [ name, setName ] = useState(order.recipient_name || "")
    const [ country, setCountry ] = useState(order.recipient_country || "GB")
    const [ address, setAddress ] = useState(order.recipient_address_line_1 || "")
    const [ city, setCity ] = useState(order.recipient_city || "")
    const [ state, setState ] = useState(order.recipient_state || "")
    const [ zip, setZip ] = useState(order.recipient_zip || "")
    async function handleSubmit() {
        const response = await fetch(`/api/order/${order.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient_name: name,
                recipient_country: country,
                recipient_address_line_1: address,
                recipient_city: city,
                recipient_state: state,
                recipient_zip: zip,
                checkout: true
            }),
        }).then((res) => res.json());
        if (response.error) {
            alert(response.error);
            return;
        }
        if (response.stripe_checkout_session_url) {
            window.location.replace(response.stripe_checkout_session_url);
        }
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-y-0 divide-x-0 divide-y divide-gray-400">
            <div className="col-span-1 p-6 flex flex-col sm:flex-row lg:flex-col justify-start">
                <label htmlFor="front-preview" className="block text-sm font-medium leading-6 text-gray-900 mb-2 w-56">
                    Preview of front
                </label>
                <div id="front-preview" className="max-w-sm max-h-[384px] rounded-md bg-gray-200 border border-gray-400 shadow-inner w-full aspect-[1/1] flex items-center justify-center text-gray-600 relative overflow-hidden h-auto">
                    <Image src={order.image_url} priority={false} alt="Generated artwork" width={512} height={512} className="object-cover absolute" />
                </div>
            </div>
            <div className="col-span-1 p-6 flex flex-col sm:flex-row lg:flex-col justify-start">
                <label htmlFor="inside-preview" className="block text-sm font-medium leading-6 text-gray-900 mb-2 w-56">
                    Preview of inside
                </label>
                <div id="inside-preview" className="max-w-sm max-h-[384px] rounded-md bg-gray-200 border border-gray-400 shadow-inner w-full aspect-[1/1] flex items-center justify-center text-gray-600 relative overflow-hidden h-auto">
                    <div id="inside-back" className="flex flex-col justify-between items-center scale-5 bg-white w-full h-full p-10 text-xs max-w-sm max-h-[384px]">
                        <div id="top-message">{order.top_message}</div>
                        <div id="middle-message" className="text-sm text-center whitespace-break-spaces">{order.middle_message}</div>
                        <div id="bottom-message">{order.bottom_message}</div>
                    </div>
                </div>
            </div>
            <div className="col-span-1 p-6">
                <form className="flex flex-col space-y-4" onSubmit={(e) => {e.preventDefault();handleSubmit()}}>
                    <div >
                    <label htmlFor="Name" className="block text-sm font-medium leading-6 text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div >
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                        Country
                    </label>
                    <div className="mt-2">
                        <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                        <option value="GB">United Kingdom</option>
                        </select>
                    </div>
                    </div>

                    <div>
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                        Street address
                    </label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                        City
                    </label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="city"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                        State / Province
                    </label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="region"
                        id="region"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>

                    <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                        ZIP / Postal code
                    </label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    </div>
                    <div className="pt-4 border-t border-gray-400 w-full">
                    <button
                            disabled={!name || !country || !address || !city || !state || !zip}
                            type="submit"
                            role="link"
                            className={classNames((!name || !country || !address || !city || !state || !zip) ? "bg-gray-200 text-gray-600 ring-gray-400 ring-1 ring-inset" : "bg-primary-600 text-white hover:bg-primary-500", "w-full rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600")}
                        >
                            Checkout with Stripe
                    </button>
                    </div>
                </form>
            </div>

        </div>
    )
}