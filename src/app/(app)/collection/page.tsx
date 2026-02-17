'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { collectionAPI } from '@/lib/api'
import type { Pokemon } from '@/lib/types'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { Loader } from '@/components/ui/Loader'
import Link from 'next/link'
import styles from './page.module.css'

export default function CollectionPage() {
  const { token } = useAuth()
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    collectionAPI.getMyPokemon(token)
      .then(setPokemon)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Ma Collection</h1>
        <Link href="/collection/team" className={styles.teamBtn}>
          Gerer l&apos;equipe
        </Link>
      </div>

      {pokemon.length === 0 ? (
        <div className={styles.empty}>
          <p>Tu n&apos;as pas encore de Pokemon !</p>
          <Link href="/arenas" className={styles.ctaLink}>
            Remporte des combats pour en obtenir
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {pokemon.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </div>
  )
}
