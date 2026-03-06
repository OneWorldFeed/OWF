import type { Metadata } from 'next'
import './globals.css'
import GlobalHeader from '@/components/header/GlobalHeader'
import LeftNav from '@/components/nav/LeftNav'

export const metadata: Metadata = {
  title: 'OneWorldFeed',
  description: 'A cinematic, emotionally intelligent global platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#060E1A]">
        <GlobalHeader />
        <LeftNav />
        <main className="ml-56 mt-14 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
