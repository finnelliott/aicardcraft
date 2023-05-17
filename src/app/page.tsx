import ProductOverview from '@/components/marketing/ProductOverview'
import ProductReviews from '@/components/marketing/ProductReviews'

export default function Home() {
  return (
    <main className="w-full h-full">
      <ProductOverview />
      <ProductReviews />
    </main>
  )
}
