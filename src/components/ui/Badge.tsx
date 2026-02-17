import styles from './Badge.module.css'

interface BadgeProps {
  name: string
  earned?: boolean
  size?: 'sm' | 'md'
}

export function ArenaBadge({ name, earned = false, size = 'md' }: BadgeProps) {
  return (
    <div className={`${styles.badge} ${earned ? styles.earned : styles.unearned} ${styles[size]}`}>
      <div className={styles.icon}>{earned ? '★' : '☆'}</div>
      <span className={styles.name}>{name}</span>
    </div>
  )
}
