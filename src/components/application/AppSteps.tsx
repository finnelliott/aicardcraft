"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { Order } from "@prisma/client";
import Link from "next/link";
import { usePathname, useSearchParams, useSelectedLayoutSegment } from "next/navigation";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

function LinkIfComplete({ href, children, disabled }: {href: string, children: React.ReactNode, disabled: boolean}) {
    if (disabled) {
        return <>{children}</>
    }
    return <Link prefetch={false} href={href}>{children}</Link>
}

export default function AppSteps({ order }: {order: Order | null}) {
    const pathname = usePathname();
    const segment = pathname?.split('/')[2];
    const searchParams = useSearchParams();
    const order_id = searchParams?.get('order_id');

    const steps = [
        { id: "01", name: 'Create artwork', href: `/create/image${(order_id !== null) ? `?order_id=${order_id}`: ""}`, status: segment === 'image' ? 'current' : 'complete', disabled: false },
        { id: "02", name: 'Insert message', href: `/create/message${(order_id !== null) ? `?order_id=${order_id}`: ""}`, status: segment === 'image' ? 'upcoming' : segment === 'message' ? 'current' : 'complete', disabled: (!order || !order.image_url) },
        { id: "03", name: 'Add recipient', href: `/create/recipient${(order_id !== null) ? `?order_id=${order_id}`: ""}`, status: segment === 'recipient' ? 'current' : 'upcoming', disabled: (!order || !order.top_message || !order.middle_message || !order.bottom_message) },
    ]

    return (
      <nav aria-label="Progress" className="mb-4 bg-gray-50">
      <ol role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === 'complete' ? (
              <LinkIfComplete href={step.href} disabled={step.disabled}>
                <button className="group flex w-full items-center" disabled={step.disabled}>
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
                </button>
              </LinkIfComplete>
            ) : step.status === 'current' ? (
              <LinkIfComplete href={step.href} disabled={step.disabled}>
                <button className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step" disabled={step.disabled}>
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                  <span className="text-indigo-600">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                </button>
              </LinkIfComplete>
            ) : (
              <LinkIfComplete href={step.href} disabled={step.disabled}>
                <button className="group flex items-center" disabled={step.disabled}>
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                  </span>
                </button>
              </LinkIfComplete>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
    )
  }
  