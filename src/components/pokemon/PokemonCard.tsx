import type { Pokemon } from '@/lib/types'
import { TypeBadge } from './TypeBadge'
import styles from './PokemonCard.module.css'

interface PokemonCardProps {
  pokemon: Pokemon
  onClick?: () => void
  selected?: boolean
}

export function PokemonCard({ pokemon, onClick, selected }: PokemonCardProps) {
  const hpPercent = (pokemon.current_hp / pokemon.max_hp) * 100

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.spriteContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pokemon.species.sprite_url}
          alt={pokemon.species.name}
          className={styles.sprite}
          width={96}
          height={96}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>
            {pokemon.nickname || pokemon.species.name}
          </span>
          <span className={styles.level}>Nv.{pokemon.level}</span>
        </div>
        <div className={styles.types}>
          {pokemon.species.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
        <div className={styles.hpSection}>
          <div className={styles.hpBar}>
            <div
              className={styles.hpFill}
              style={{
                width: `${hpPercent}%`,
                backgroundColor: hpPercent > 50 ? 'var(--accent-success)' : hpPercent > 20 ? 'var(--accent-warning)' : 'var(--accent-danger)',
              }}
            />
          </div>
          <span className={styles.hpText}>{pokemon.current_hp}/{pokemon.max_hp}</span>
        </div>
      </div>
    </div>
  )
}
