import type { Attack } from '@/lib/types'
import { TYPE_COLORS } from '@/lib/constants'
import styles from './AttackButton.module.css'

interface AttackButtonProps {
  attack: Attack
  onClick?: () => void
  disabled?: boolean
}

export function AttackButton({ attack, onClick, disabled }: AttackButtonProps) {
  const noPP = (attack.current_pp ?? attack.pp) <= 0

  return (
    <button
      className={styles.button}
      style={{
        borderColor: TYPE_COLORS[attack.type],
        opacity: noPP || disabled ? 0.4 : 1,
      }}
      onClick={onClick}
      disabled={disabled || noPP}
    >
      <div className={styles.top}>
        <span className={styles.name}>{attack.name}</span>
        <span
          className={styles.typeDot}
          style={{ backgroundColor: TYPE_COLORS[attack.type] }}
        />
      </div>
      <div className={styles.bottom}>
        <span className={styles.detail}>Puiss. {attack.power || '—'}</span>
        <span className={styles.detail}>Prec. {attack.accuracy}%</span>
        <span className={styles.pp}>
          PP {attack.current_pp ?? attack.pp}/{attack.pp}
        </span>
      </div>
    </button>
  )
}
