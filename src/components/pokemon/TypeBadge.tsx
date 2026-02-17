import type { PokemonType } from '@/lib/types'
import { TYPE_COLORS, TYPE_LABELS } from '@/lib/constants'
import styles from './TypeBadge.module.css'

interface TypeBadgeProps {
  type: PokemonType
  size?: 'sm' | 'md'
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      style={{ backgroundColor: TYPE_COLORS[type] }}
    >
      {TYPE_LABELS[type]}
    </span>
  )
}
