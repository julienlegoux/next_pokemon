'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { pokedexAPI } from '@/lib/api'
import type { Species, PokemonType } from '@/lib/types'
import { PokemonMiniCard } from '@/components/pokemon/PokemonMiniCard'
import { Loader } from '@/components/ui/Loader'
import styles from './page.module.css'

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

export default function PokedexPage() {
  const { token } = useAuth()
  const [species, setSpecies] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<PokemonType | ''>('')

  useEffect(() => {
    if (!token) return
    pokedexAPI.listSpecies(token)
      .then(setSpecies)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const filtered = species.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = !filterType || s.types.includes(filterType)
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <h1 className={styles.title}>Pokedex</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher un Pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as PokemonType | '')}
          className={styles.select}
        >
          <option value="">Tous les types</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>Aucun Pokemon trouve</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((s) => (
            <PokemonMiniCard key={s.id} species={s} />
          ))}
        </div>
      )}
    </div>
  )
}
