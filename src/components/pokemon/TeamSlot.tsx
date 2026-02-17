import type { Pokemon } from '@/lib/types'
import { TypeBadge } from './TypeBadge'
import styles from './TeamSlot.module.css'

interface TeamSlotProps {
  index: number
  pokemon?: Pokemon
  onRemove?: () => void
  onClick?: () => void
}

export function TeamSlot({ index, pokemon, onRemove, onClick }: TeamSlotProps) {
  if (!pokemon) {
    return (
      <div className={styles.empty} onClick={onClick}>
        <span className={styles.emptyIcon}>+</span>
        <span className={styles.emptyText}>Slot {index + 1}</span>
      </div>
    )
  }

  return (
    <div className={styles.slot}>
      <div className={styles.spriteContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pokemon.species.sprite_url}
          alt={pokemon.species.name}
          className={styles.sprite}
          width={64}
          height={64}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{pokemon.nickname || pokemon.species.name}</span>
        <span className={styles.level}>Nv.{pokemon.level}</span>
        <div className={styles.types}>
          {pokemon.species.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </div>
      {onRemove && (
        <button className={styles.removeBtn} onClick={onRemove}>
          &#10005;
        </button>
      )}
    </div>
  )
}
