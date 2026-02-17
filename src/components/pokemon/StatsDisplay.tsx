import type { Stats } from '@/lib/types'
import { STAT_LABELS } from '@/lib/constants'
import styles from './StatsDisplay.module.css'

interface StatsDisplayProps {
  stats: Stats
}

const MAX_STAT = 255

export function StatsDisplay({ stats }: StatsDisplayProps) {
  const entries = Object.entries(stats) as [keyof Stats, number][]

  return (
    <div className={styles.container}>
      {entries.map(([key, value]) => (
        <div key={key} className={styles.row}>
          <span className={styles.label}>{STAT_LABELS[key] || key}</span>
          <span className={styles.value}>{value}</span>
          <div className={styles.barBg}>
            <div
              className={styles.barFill}
              style={{
                width: `${(value / MAX_STAT) * 100}%`,
                backgroundColor: getStatColor(value),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatColor(value: number): string {
  if (value >= 150) return 'var(--accent-success)'
  if (value >= 100) return 'var(--accent-tertiary)'
  if (value >= 60) return 'var(--accent-secondary)'
  if (value >= 30) return 'var(--accent-warning)'
  return 'var(--accent-danger)'
}
