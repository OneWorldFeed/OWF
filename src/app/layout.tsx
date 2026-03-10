'use client';
import type { Metadata } from 'next'
import './globals.css'
import GlobalHeader from '@/components/header/GlobalHeader'
import LeftNav from '@/components/nav/LeftNav'
import BottomNav from '@/components/nav/BottomNav'
import { ThemeProvider } from '@/context/ThemeProvider'
import { useEffect } from 'react'

// Cursor glow — desktop only, disabled on touch devices via CSS
function CursorGlow() {
  useEffect(() => {
    const el = document.getElementById('owf-cursor-glow');
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top  = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div id="owf-cursor-glow" aria-hidden="true" />;
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
          <CursorGlow />
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
