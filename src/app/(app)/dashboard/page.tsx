'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { profileAPI } from '@/lib/api'
import type { Profile } from '@/lib/types'
import { Loader } from '@/components/ui/Loader'
import { ArenaBadge } from '@/components/ui/Badge'
import styles from './page.module.css'
import Link from 'next/link'

export default function DashboardPage() {
  const { token } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    profileAPI.get(token)
      .then(setProfile)
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

  if (!profile) {
    return <div className={styles.center}>Impossible de charger le profil</div>
  }

  const xpPercent = profile.xp % 100

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Profil Dresseur</h2>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              {profile.trainer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.trainerName}>{profile.trainer_name}</p>
              <p className={styles.level}>Niveau {profile.level}</p>
            </div>
          </div>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <p className={styles.xpText}>{profile.xp} XP</p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Statistiques</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{profile.money}</span>
              <span className={styles.statLabel}>Pokedollars</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{profile.pokemon_count}</span>
              <span className={styles.statLabel}>Pokemon</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{profile.battles_won}</span>
              <span className={styles.statLabel}>Victoires</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{profile.battles_lost}</span>
              <span className={styles.statLabel}>Defaites</span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Badges</h2>
          {profile.badges.length === 0 ? (
            <p className={styles.empty}>Aucun badge obtenu</p>
          ) : (
            <div className={styles.badges}>
              {profile.badges.map((badge) => (
                <ArenaBadge key={badge.id} name={badge.name} earned />
              ))}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Actions rapides</h2>
          <div className={styles.actions}>
            <Link href="/arenas" className={styles.actionBtn}>
              Combattre une arene
            </Link>
            <Link href="/collection/team" className={styles.actionBtnSecondary}>
              Gerer mon equipe
            </Link>
            <Link href="/pokedex" className={styles.actionBtnSecondary}>
              Consulter le Pokedex
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
