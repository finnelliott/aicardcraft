import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'
import './globals.css'

export const metadata = {
  title: 'AI Card Craft',
  description: 'Creat one-of-a-kind greetings cards with AI artwork.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="text-black bg-[#FBE7DA]">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
