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
      <body style={{ backgroundColor: 'var(--owf-bg)', color: 'var(--owf-text-primary)' }}>
        <GlobalHeader />
        <LeftNav />
        <main className="ml-56 mt-14 min-h-screen" style={{ backgroundColor: 'var(--owf-bg)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
