import styles from './HPBar.module.css'

interface HPBarProps {
  current: number
  max: number
  label?: string
  showText?: boolean
}

export function HPBar({ current, max, label, showText = true }: HPBarProps) {
  const percent = Math.max(0, Math.min(100, (current / max) * 100))

  let colorClass = styles.high
  if (percent <= 20) colorClass = styles.low
  else if (percent <= 50) colorClass = styles.medium

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.barBg}>
        <div
          className={`${styles.barFill} ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showText && (
        <span className={styles.text}>
          {current}/{max}
        </span>
      )}
    </div>
  )
}
