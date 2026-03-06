'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home',    href: '/',        icon: '⌂' },
  { label: 'Social',  href: '/social',  icon: '◈' },
  { label: 'AI',      href: '/ai',      icon: '◎' },
  { label: 'Profile', href: '/profile', icon: '○' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--owf-surface)',
        borderTop: '1px solid var(--owf-border)',
      }}
    >
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
            style={{ color: active ? 'var(--owf-gold)' : 'var(--owf-text-secondary)' }}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {active && (
              <div
                className="absolute bottom-1.5 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--owf-gold)' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
