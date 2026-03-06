'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home',     href: '/',        icon: '/icons/home.svg'     },
  { label: 'Social',   href: '/social',  icon: '/icons/social.svg'   },
  { label: 'AI',       href: '/ai',      icon: '/icons/ai.svg'       },
  { label: 'Discover', href: '/discover',icon: '/icons/discover.svg' },
  { label: 'Profile',  href: '/profile', icon: '/icons/profile.svg'  },
  { label: 'Settings', href: '/settings',icon: '/icons/settings.svg' },
];

export default function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-14 bottom-0 w-56 bg-[#060E1A] border-r border-[#0D1F35] flex flex-col py-4 px-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
              active
                ? 'bg-[#0D1F35] text-[#D97706]'
                : 'text-[#9CA3AF] hover:bg-[#0D1F35] hover:text-white'
            }`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={20}
              height={20}
              className={`opacity-${active ? '100' : '60'}`}
            />
            <span className="text-sm font-medium">{item.label}</span>
            {active && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
