'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { Loader } from '@/components/ui/Loader'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader size={50} />
      </div>
    )
  }

  if (user) return null

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Pokemon <span className={styles.accent}>Fight</span>
          </h1>
          <p className={styles.description}>
            Deviens le meilleur dresseur ! Affronte les champions d&apos;arene
            dans des combats strategiques tour par tour.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>&#9876;</span>
              <span>Combats strategiques</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>&#127942;</span>
              <span>8 arenes a conquerir</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>&#129302;</span>
              <span>Champions IA intelligents</span>
            </div>
          </div>
          <Link href="/login" className={styles.cta}>
            Commencer l&apos;aventure
          </Link>
        </div>
      </main>
    </div>
  )
}
