import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Porto Meetup Buddy',
  description: 'Porto Design Meetup companion — agenda, activities, photos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-porto-black min-h-screen">{children}</body>
    </html>
  )
}
