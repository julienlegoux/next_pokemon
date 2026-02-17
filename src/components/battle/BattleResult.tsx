'use client'

import type { BattleRewards } from '@/lib/types'
import Link from 'next/link'
import styles from './BattleResult.module.css'

interface BattleResultProps {
  result: 'won' | 'lost'
  rewards?: BattleRewards
}

export function BattleResult({ result, rewards }: BattleResultProps) {
  const won = result === 'won'

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h1 className={`${styles.title} ${won ? styles.victory : styles.defeat}`}>
          {won ? 'Victoire !' : 'Defaite...'}
        </h1>

        {rewards && (
          <div className={styles.rewards}>
            <div className={styles.reward}>
              <span className={styles.rewardLabel}>XP gagne</span>
              <span className={styles.rewardValue}>+{rewards.xp_gained}</span>
            </div>
            <div className={styles.reward}>
              <span className={styles.rewardLabel}>Pokedollars</span>
              <span className={styles.rewardValue}>+{rewards.money_gained}</span>
            </div>
            {rewards.badge && (
              <div className={styles.badgeReward}>
                <span className={styles.badgeIcon}>★</span>
                <span>Badge {rewards.badge.name} obtenu !</span>
              </div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/arenas" className={styles.btn}>
            Retour aux arenes
          </Link>
          <Link href="/dashboard" className={styles.btnSecondary}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
