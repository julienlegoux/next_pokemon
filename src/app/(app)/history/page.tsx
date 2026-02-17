'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { battleAPI } from '@/lib/api'
import type { BattleHistoryEntry } from '@/lib/types'
import { Loader } from '@/components/ui/Loader'
import styles from './page.module.css'

export default function HistoryPage() {
  const { token } = useAuth()
  const [history, setHistory] = useState<BattleHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    battleAPI.getHistory(token)
      .then(setHistory)
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
      <h1 className={styles.title}>Historique des combats</h1>

      {history.length === 0 ? (
        <p className={styles.empty}>Aucun combat enregistre</p>
      ) : (
        <div className={styles.list}>
          {history.map((entry) => (
            <div key={entry.id} className={styles.card}>
              <div className={styles.cardLeft}>
                <div className={styles.result}>
                  <span className={`${styles.badge} ${entry.result === 'won' ? styles.won : styles.lost}`}>
                    {entry.result === 'won' ? 'Victoire' : 'Defaite'}
                  </span>
                </div>
                <div className={styles.info}>
                  <span className={styles.arena}>{entry.arena_name}</span>
                  <span className={styles.champion}>vs {entry.champion_name}</span>
                </div>
              </div>
              <div className={styles.cardRight}>
                <div className={styles.stats}>
                  <span className={styles.stat}>+{entry.xp_gained} XP</span>
                  <span className={styles.stat}>+{entry.money_gained} $</span>
                  <span className={styles.stat}>{entry.turns} tours</span>
                </div>
                <span className={styles.date}>
                  {new Date(entry.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
