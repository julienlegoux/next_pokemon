import styles from './Loader.module.css'

export function Loader({ size = 40 }: { size?: number }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Chargement"
    />
  )
}
