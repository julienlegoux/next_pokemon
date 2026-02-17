import type { Attack } from '@/lib/types'
import { AttackButton } from '@/components/pokemon/AttackButton'
import styles from './AttackPanel.module.css'

interface AttackPanelProps {
  attacks: Attack[]
  onAttack: (attackId: number) => void
  onSwitch: () => void
  disabled: boolean
}

export function AttackPanel({ attacks, onAttack, onSwitch, disabled }: AttackPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {attacks.map((attack) => (
          <AttackButton
            key={attack.id}
            attack={attack}
            onClick={() => onAttack(attack.id)}
            disabled={disabled}
          />
        ))}
      </div>
      <button
        className={styles.switchBtn}
        onClick={onSwitch}
        disabled={disabled}
      >
        Changer de Pokemon
      </button>
    </div>
  )
}
