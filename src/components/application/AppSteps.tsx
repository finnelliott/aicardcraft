"use client";

import { Order } from "@prisma/client";
import Link from "next/link";
import { usePathname, useSearchParams, useSelectedLayoutSegment } from "next/navigation";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function AppSteps({ order }: {order: Order | null}) {
    const pathname = usePathname();
    const segment = pathname?.split('/')[2];
    const searchParams = useSearchParams();
    const order_id = searchParams?.get('order_id');

    const steps = [
        { name: 'Step 1', href: `/create/image${(order_id !== null) ? `?order_id=${order_id}`: ""}`, status: segment === 'image' ? 'current' : 'complete', disabled: false },
        { name: 'Step 2', href: `/create/message${(order_id !== null) ? `?order_id=${order_id}`: ""}`, status: segment === 'image' ? 'upcoming' : segment === 'message' ? 'current' : 'complete', disabled: (!order || !order.image_url) },
        { name: 'Step 3', href: `/create/recipient${(order_id !== null) ? `?order_id=${order_id}`: ""}`, status: segment === 'recipient' ? 'current' : 'upcoming', disabled: (!order || !order.top_message || !order.middle_message || !order.bottom_message) },
    ]

    return (
      <nav className="flex items-center justify-center py-8" aria-label="Progress">
        <p className="text-sm font-medium">
          Step {steps.findIndex((step) => step.status === 'current') + 1} of {steps.length}
        </p>
        <ol role="list" className="ml-8 flex items-center space-x-5">
          {steps.map((step) => (
            <li key={step.name}>
              {step.status === 'complete' ? (
                <Link href={!step.disabled ? step.href : ""} className={classNames(step.disabled ? "pointer-events-none" : "pointer-events-auto", "block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900")} >
                  <span className="sr-only">{step.name}</span>
                </Link>
              ) : step.status === 'current' ? (
                <Link href={!step.disabled ? step.href : ""} className={classNames(step.disabled ? "pointer-events-none" : "pointer-events-auto", "relative flex items-center justify-center")} aria-current="step">
                  <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                    <span className="h-full w-full rounded-full bg-indigo-200" />
                  </span>
                  <span className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </Link>
              ) : (
                <Link href={!step.disabled ? step.href : ""} className={classNames(step.disabled ? "pointer-events-none" : "pointer-events-auto", "block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400")}>
                  <span className="sr-only">{step.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }
  