import Footer from '@/components/navigation/Footer'
import Header from '@/components/navigation/Header'
import './globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="text-black">
      <body>
        <Header />
        
        {children}
        <Footer />
      </body>
    </html>
  )
}
