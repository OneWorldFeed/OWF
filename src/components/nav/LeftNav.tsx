'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ── Inline SVG icons (thin stroke, no fills) ──────────────────────────────────
const ICONS: Record<string, React.ReactElement> = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/><path d="M5 10v11h14V10"/>
    </svg>
  ),
  social: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  discover: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  feed: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 6a6 6 0 0 1 6 6"/>
      <path d="M12 10a2 2 0 0 1 2 2"/>
    </svg>
  ),
  news: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
      <path d="M2 6h2"/><line x1="10" y1="7" x2="18" y2="7"/><line x1="10" y1="11" x2="18" y2="11"/>
      <line x1="10" y1="15" x2="14" y2="15"/>
    </svg>
  ),
  podcast: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="3"/><path d="M12 17v4"/><path d="M8 21h8"/>
      <path d="M6.3 14.3A7 7 0 1 1 17.7 14.3"/>
    </svg>
  ),
  music: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  ai: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  dm: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  profile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  globe: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--owf-horizon)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
}

const navItems = [
  { label: 'Home',     href: '/',         icon: ICONS.home     },
  { label: 'Social',   href: '/social',   icon: ICONS.social   },
  { label: 'Discover', href: '/discover', icon: ICONS.discover },
  { label: 'The Feed', href: '/the-feed', icon: ICONS.feed     },
  { label: 'News',     href: '/news',     icon: ICONS.news     },
  { label: 'Podcast',  href: '/podcast',  icon: ICONS.podcast  },
  { label: 'Music',    href: '/music',    icon: ICONS.music    },
  { label: 'AI',       href: '/ai',       icon: ICONS.ai       },
  { label: 'DM',       href: '/dm',       icon: ICONS.dm       },
  { label: 'Profile',  href: '/profile',  icon: ICONS.profile  },
  { label: 'Settings', href: '/settings', icon: ICONS.settings },
]

const CYAN = 'var(--owf-horizon)'

export default function LeftNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position:        'fixed',
        left:            0,
        top:             '56px',
        bottom:          0,
        width:           '224px',
        display:         'flex',
        flexDirection:   'column',
        padding:         '12px 0',
        overflowY:       'auto',
        backgroundColor: 'var(--owf-bg)',
        borderRight:     `1px solid var(--owf-border)`,
        zIndex:          40,
      }}
    >
      {/* OWF logo area */}
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '8px',
        padding:       '0 16px 16px',
        borderBottom:  'none',
        marginBottom:  '4px',
      }}>
        {ICONS.globe}
        <span style={{
          fontSize:      '10px',
          fontWeight:    700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         CYAN,
          fontFamily:    'monospace',
        }}>
          OWF
        </span>
        <span style={{
          fontSize:      '9px',
          letterSpacing: '0.12em',
          color:         'var(--owf-text-muted)',
          fontFamily:    'monospace',
        }}>
          ONE WORLD FEED
        </span>
      </div>

      {/* Cyan divider */}
      <div style={{
        height:     '1px',
        background: `linear-gradient(90deg, transparent, ${CYAN}40, transparent)`,
        margin:     '0 16px 12px',
      }} />

      {/* Nav items */}
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <NavItem key={item.href} item={item} active={active} />
        )
      })}
    </nav>
  )
}

function NavItem({
  item,
  active,
}: {
  item: { label: string; href: string; icon: React.ReactElement }
  active: boolean
}) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '10px',
        padding:       '9px 16px',
        margin:        '1px 8px',
        borderRadius:  '0',
        borderLeft:    active
          ? `2px solid ${CYAN}`
          : hov
          ? `2px solid rgba(var(--owf-horizon-rgb), 0.40)`
          : '2px solid transparent',
        color: active || hov ? CYAN : 'var(--owf-text-sub)',
        textDecoration:'none',
        transition:    'color 0.15s, border-color 0.15s, background 0.15s, box-shadow 0.15s',
        background:    active
          ? 'rgba(var(--owf-horizon-rgb), 0.05)'
          : hov
          ? 'rgba(var(--owf-horizon-rgb), 0.03)'
          : 'transparent',
        boxShadow:     active
          ? `inset 0 0 20px rgba(var(--owf-horizon-rgb), 0.04)`
          : 'none',
      }}
    >
      {/* Icon */}
      <span style={{
        opacity:    active || hov ? 1 : 0.45,
        flexShrink: 0,
        transition: 'opacity 0.15s',
      }}>
        {item.icon}
      </span>

      {/* Label */}
      <span style={{
        fontSize:      '12px',
        fontWeight:    active ? 600 : 400,
        letterSpacing: '0.05em',
        lineHeight:    1,
      }}>
        {item.label}
      </span>

      {/* Active glow dot */}
      {active && (
        <span style={{
          marginLeft:   'auto',
          width:        '4px',
          height:       '4px',
          borderRadius: '50%',
          background:   CYAN,
          boxShadow:    `0 0 6px ${CYAN}`,
          flexShrink:   0,
        }} />
      )}
    </Link>
  )
}

