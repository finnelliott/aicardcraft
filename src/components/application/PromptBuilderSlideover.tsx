import React, { Fragment, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { PlusSmallIcon, XMarkIcon, MinusSmallIcon } from '@heroicons/react/24/outline'

import categories from '@/data/prompt_hints.json'

export default function PromptBuilderSlideover({ open, setOpen, prompt, setPrompt }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, prompt: string, setPrompt: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Prompt builder
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div>
                            <div className="flex items-center justify-between h-4">
                                <label htmlFor="prompt" className="block text-sm font-medium leading-6 text-gray-900">
                                    Prompt
                                </label>
                            </div>
                            <div className="mt-2">
                                <textarea
                                rows={4}
                                name="prompt"
                                id="prompt"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                aria-describedby="prompt-description"
                                />
                            </div>
                        </div>

                        <div className="py-8">
                            <div className="divide-y divide-gray-900/10">
                            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 py-4">Ideas for your prompt</h2>
                            <dl className="space-y-6 divide-y divide-gray-900/10">
                                {categories.map((category: any, index: any) => (
                                <Disclosure as="div" key={index} className="pt-6">
                                    {({ open }) => (
                                    <>
                                        <dt>
                                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                            <span className="text-base font-semibold leading-7 capitalize">{category.name}</span>
                                            <span className="ml-6 flex h-7 items-center">
                                            {open ? (
                                                <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                            )}
                                            </span>
                                        </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel as="dd" className="mt-2 px-6 py-4">
                                        <p className="text-base leading-7 text-gray-600">
                                        {category.subcategories.map((subcategory: any, index: any) => (
                                            <Disclosure as="div" key={index} className="pt-6">
                                                {({ open }) => (
                                                <>
                                                    <dt>
                                                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                                        <span className="text-base font-semibold leading-7 capitalize">{subcategory.name}</span>
                                                        <span className="ml-6 flex h-7 items-center">
                                                        {open ? (
                                                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                                        ) : (
                                                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                                        )}
                                                        </span>
                                                    </Disclosure.Button>
                                                    </dt>
                                                    <Disclosure.Panel as="dd" className="mt-2 pr-12 py-4">
                                                    <p className="text-base leading-7 text-gray-600">
                                                            {subcategory.items.map((item: any, index: any) => (
                                                                <button onClick={() => {const newPrompt = (prompt.length > 0 ? prompt + ", " + item : item); setPrompt(newPrompt)}} key={index} className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-2 mb-2">
                                                                    {item}
                                                                </button>
                                                            ))}
                                                    </p>
                                                    </Disclosure.Panel>
                                                </>
                                                )}
                                            </Disclosure>
                                        ))}
                                        </p>
                                        </Disclosure.Panel>
                                    </>
                                    )}
                                </Disclosure>
                                ))}
                            </dl>
                            </div>
                        </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
