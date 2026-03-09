import type { Metadata } from 'next'
import './globals.css'
import GlobalHeader from '@/components/header/GlobalHeader'
import LeftNav from '@/components/nav/LeftNav'
import BottomNav from '@/components/nav/BottomNav'
import { ThemeProvider } from '@/context/ThemeProvider'

export const metadata: Metadata = {
  title: 'OneWorldFeed',
  description: 'A cinematic, emotionally intelligent global platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        style={{
          backgroundColor: 'var(--owf-bg)',
          color: 'var(--owf-text-primary)',
        }}
      >
        <ThemeProvider>
          <GlobalHeader />
          <div className="hidden md:block">
            <LeftNav />
          </div>
          <main
            className="mt-14 pb-20 md:pb-0 md:ml-56"
            style={{
              backgroundColor: 'var(--owf-bg)',
            }}
          >
            {children}
          </main>
          <div className="block md:hidden">
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
