import type { Species } from '@/lib/types'
import { TypeBadge } from './TypeBadge'
import styles from './PokemonMiniCard.module.css'
import Link from 'next/link'

interface PokemonMiniCardProps {
  species: Species
}

export function PokemonMiniCard({ species }: PokemonMiniCardProps) {
  return (
    <Link href={`/pokedex/${species.id}`} className={styles.card}>
      <div className={styles.spriteContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={species.sprite_url}
          alt={species.name}
          className={styles.sprite}
          width={72}
          height={72}
        />
      </div>
      <span className={styles.id}>#{String(species.id).padStart(3, '0')}</span>
      <span className={styles.name}>{species.name}</span>
      <div className={styles.types}>
        {species.types.map((t) => (
          <TypeBadge key={t} type={t} size="sm" />
        ))}
      </div>
    </Link>
  )
}
