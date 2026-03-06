import type { Metadata } from 'next'
import './globals.css'

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
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
