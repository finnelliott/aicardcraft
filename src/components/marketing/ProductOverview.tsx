"use client";
import { useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import Image from 'next/image';

const product = {
  name: 'AI-Generated Artwork Greetings Card',
  price: '£3.50',
  images: [
    {
      src: '/card-mockup-1.png',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: '/card-mockup-2.png',
      alt: 'Model wearing plain black basic tee.',
    },
    {
      src: '/card-mockup-3.png',
      alt: 'Model wearing plain gray basic tee.',
    },
    {
      src: '/card-mockup-4.png',
      alt: 'Model wearing plain white basic tee.',
    },
  ],
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: false },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
    { name: '2XL', inStock: true },
    { name: '3XL', inStock: true },
  ],
  description:
    'Unleash your creativity with our unique 5.5x5.5" square greetings card, featuring AI-generated artwork designed by you! This innovative card allows you to create a one-of-a-kind masterpiece that will leave a lasting impression on your recipient.',
  highlights: [
    "AI-Generated Artwork: Harness the power of artificial intelligence to generate your own custom artwork for the card cover. Simply input your preferences and let the AI do the rest, creating a stunning and personalized design.",
    "High-Quality Gloss Coating: Our cards are finished with a premium gloss coating, ensuring your artwork truly shines and stands out.",
    "Kraft Envelope Included: Each card is sent directly to your recipient in a stylish and eco-friendly kraft envelope, adding a touch of elegance to your thoughtful gesture.",
    "Fast Delivery: Rest assured that your card will be delivered in just 2-3 working days, making it perfect for last-minute occasions or when you simply can't wait to share your creation.",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
}
const reviews = { href: '#reviews', average: 5, totalCount: 4 }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductOverview() {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[2])

  return (
    <div className="">
      <div className="">

        {/* Image gallery */}
        <div className="mx-auto mt-6 sm:px-6 grid max-w-7xl grid-cols-2 lg:grid-cols-4 gap-8 px-4 lg:px-8">
          <div className="aspect-square overflow-hidden rounded-lg block">
            <Image
              width={500}
              height={500}
              src={product.images[0].src}
              alt={product.images[0].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              width={500}
              height={500}
              src={product.images[1].src}
              alt={product.images[1].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              width={500}
              height={500}
              src={product.images[2].src}
              alt={product.images[2].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <Image
              width={500}
              height={500}
              src={product.images[3].src}
              alt={product.images[3].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-400 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">{product.price}{` `}<span className='text-lg tracking-tight text-gray-600'>{`(incl. delivery)`}</span></p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-primary-600 hover:text-primary-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/craft/image">
              <button
                type="button"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Craft a card
              </button>
              </Link>
            </div>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-400 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
