"use client";

import { Order } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

export default function OrderIncomplete({ order }: { order: Order }) {
    const [ isLoading, setIsLoading ] = useState(true);

    if (!order.paid) {
        setTimeout(() => {
            fetch(process.env.NEXT_PUBLIC_HOST_URL + `/api/order/${order.id}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => {
                    if (data.paid) {
                        location.reload();
                    } else {
                        setIsLoading(false);
                    }
                }
            );
        }, 5000);
    }

    if (isLoading) {
        return (
            <main>
                <div className="w-full bg-gray-50 py-16 text-center h-96">
                    <div className="max-w-3xl mx-auto p-4 pb-8 flex items-center flex-col">
                        Loading...
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main>
        <div className="w-full bg-gray-50 py-16 text-center h-96">
            <div className="max-w-3xl mx-auto p-4 pb-8 flex items-center flex-col">
                <h1 className="text-3xl font-bold text-gray-900 pb-4">Order incomplete</h1>
                <Link
                    href={`/create/image?order_id=${order.id}`}
                    className="text-indigo-600 hover:text-indigo-700"
                >
                    Click here to complete your order
                </Link>
            </div>
        </div>
        </main>
    )
}

