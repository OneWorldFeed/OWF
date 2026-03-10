'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home',     href: '/',         icon: '/icons/home.svg'     },
  { label: 'Social',   href: '/social',   icon: '/icons/social.svg'   },
  { label: 'Discover', href: '/discover', icon: '/icons/discover.svg' },
  { label: 'Live',     href: '/live',     icon: '/icons/live.svg'     },
  { label: 'News',     href: '/news',     icon: '/icons/news.svg'     },
  { label: 'Podcast',  href: '/podcast',  icon: '/icons/podcast.svg'  },
  { label: 'Music',    href: '/music',    icon: '/icons/music.svg'    },
  { label: 'AI',       href: '/ai',       icon: '/icons/ai.svg'       },
  { label: 'DM',       href: '/dm',       icon: '/icons/social.svg'   },
  { label: 'Profile',  href: '/profile',  icon: '/icons/profile.svg'  },
  { label: 'Settings', href: '/settings', icon: '/icons/settings.svg' },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 top-14 bottom-0 w-56 flex flex-col py-4 px-3 overflow-y-auto"
      style={{
        backgroundColor: 'var(--owf-surface)',
        borderRight: '1px solid var(--owf-border)',
      }}
    >
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all"
            style={{
              backgroundColor: active ? 'var(--owf-bg)' : 'transparent',
              color: active ? 'var(--owf-gold)' : 'var(--owf-text-secondary)',
            }}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={20}
              height={20}
              style={{ opacity: active ? 1 : 0.5 }}
            />
            <span className="text-sm font-medium">{item.label}</span>
            {active && (
              <span
                className="ml-auto w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--owf-gold)' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
