'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { arenaAPI } from '@/lib/api'
import type { Arena } from '@/lib/types'
import { Loader } from '@/components/ui/Loader'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import Link from 'next/link'
import styles from './page.module.css'

export default function ArenasPage() {
  const { token } = useAuth()
  const [arenas, setArenas] = useState<Arena[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    arenaAPI.list(token)
      .then(setArenas)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <h1 className={styles.title}>Arenes</h1>

      <div className={styles.grid}>
        {arenas.map((arena) => (
          <div key={arena.id} className={`${styles.card} ${arena.is_defeated ? styles.defeated : ''}`}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.arenaName}>{arena.name}</h2>
                <p className={styles.champion}>Champion: {arena.champion_name}</p>
              </div>
              <TypeBadge type={arena.type_specialty} />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Badge</span>
                <span className={styles.badge}>
                  {arena.is_defeated ? '★' : '☆'} {arena.badge.name}
                </span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Difficulte</span>
                <span className={styles.difficulty}>
                  {'★'.repeat(arena.difficulty)}{'☆'.repeat(5 - arena.difficulty)}
                </span>
              </div>
            </div>

            <Link
              href={`/arenas/${arena.id}/battle`}
              className={styles.battleBtn}
            >
              {arena.is_defeated ? 'Revanche' : 'Combattre'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
