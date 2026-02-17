'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { pokedexAPI } from '@/lib/api'
import type { Species } from '@/lib/types'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import { StatsDisplay } from '@/components/pokemon/StatsDisplay'
import { Loader } from '@/components/ui/Loader'
import Link from 'next/link'
import styles from './page.module.css'

export default function SpeciesDetailPage() {
  const { token } = useAuth()
  const params = useParams()
  const id = Number(params.id)
  const [species, setSpecies] = useState<Species | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !id) return
    pokedexAPI.getSpecies(token, id)
      .then(setSpecies)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token, id])

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    )
  }

  if (!species) {
    return <div className={styles.center}>Pokemon non trouve</div>
  }

  return (
    <div className={styles.page}>
      <Link href="/pokedex" className={styles.back}>
        &larr; Retour au Pokedex
      </Link>

      <div className={styles.header}>
        <div className={styles.spriteContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={species.sprite_url}
            alt={species.name}
            className={styles.sprite}
            width={160}
            height={160}
          />
        </div>
        <div className={styles.headerInfo}>
          <span className={styles.id}>#{String(species.id).padStart(3, '0')}</span>
          <h1 className={styles.name}>{species.name}</h1>
          <div className={styles.types}>
            {species.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          {species.description && (
            <p className={styles.description}>{species.description}</p>
          )}
          {(species.height || species.weight) && (
            <div className={styles.physical}>
              {species.height && <span>Taille: {species.height / 10} m</span>}
              {species.weight && <span>Poids: {species.weight / 10} kg</span>}
            </div>
          )}
        </div>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Statistiques de base</h2>
          <StatsDisplay stats={species.base_stats} />
        </div>

        {species.attacks && species.attacks.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Attaques</h2>
            <div className={styles.attacks}>
              {species.attacks.map((a) => (
                <div key={a.id} className={styles.attackRow}>
                  <span className={styles.attackName}>{a.name}</span>
                  <TypeBadge type={a.type} size="sm" />
                  <span className={styles.attackDetail}>{a.category}</span>
                  <span className={styles.attackDetail}>Puiss. {a.power || '—'}</span>
                  <span className={styles.attackDetail}>Prec. {a.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {species.evolutions && species.evolutions.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Evolutions</h2>
            <div className={styles.evolutions}>
              {species.evolutions.map((evo) => (
                <Link
                  key={evo.to_species_id}
                  href={`/pokedex/${evo.to_species_id}`}
                  className={styles.evoItem}
                >
                  <span className={styles.evoArrow}>&rarr;</span>
                  <span className={styles.evoName}>{evo.to_species_name}</span>
                  <span className={styles.evoLevel}>Nv. {evo.level_required}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
