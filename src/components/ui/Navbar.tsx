'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pokedex', label: 'Pokedex' },
  { href: '/collection', label: 'Collection' },
  { href: '/arenas', label: 'Arenes' },
  { href: '/history', label: 'Historique' },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.logo}>
          Pokemon <span className={styles.logoAccent}>Fight</span>
        </Link>

        <div className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${pathname.startsWith(item.href) ? styles.linkActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.right}>
          {user && (
            <>
              <span className={styles.trainer}>{user.trainer_name}</span>
              <button onClick={logout} className={styles.logout}>
                Deconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
