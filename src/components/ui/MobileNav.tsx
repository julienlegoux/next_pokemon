'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './MobileNav.module.css'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/pokedex', label: 'Pokedex' },
  { href: '/collection', label: 'Equipe' },
  { href: '/arenas', label: 'Arenes' },
  { href: '/history', label: 'Combats' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.item} ${pathname.startsWith(item.href) ? styles.itemActive : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
