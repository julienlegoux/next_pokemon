'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState, useCallback } from 'react'
import { collectionAPI } from '@/lib/api'
import type { Pokemon } from '@/lib/types'
import { TeamSlot } from '@/components/pokemon/TeamSlot'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import { Loader } from '@/components/ui/Loader'
import { useToast } from '@/components/ui/Toast'
import { MAX_TEAM_SIZE } from '@/lib/constants'
import Link from 'next/link'
import styles from './page.module.css'

export default function TeamPage() {
  const { token } = useAuth()
  const { showToast } = useToast()
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [team, setTeam] = useState<(Pokemon | undefined)[]>(Array(MAX_TEAM_SIZE).fill(undefined))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) return
    Promise.all([
      collectionAPI.getMyPokemon(token),
      collectionAPI.getTeam(token),
    ])
      .then(([all, teamData]) => {
        setAllPokemon(all)
        const teamSlots: (Pokemon | undefined)[] = Array(MAX_TEAM_SIZE).fill(undefined)
        teamData.forEach((p, i) => {
          if (i < MAX_TEAM_SIZE) teamSlots[i] = p
        })
        setTeam(teamSlots)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const teamIds = new Set(team.filter(Boolean).map((p) => p!.id))
  const availablePokemon = allPokemon.filter((p) => !teamIds.has(p.id))

  const addToTeam = useCallback((pokemon: Pokemon) => {
    setTeam((prev) => {
      const emptyIndex = prev.findIndex((p) => !p)
      if (emptyIndex === -1) return prev
      const next = [...prev]
      next[emptyIndex] = pokemon
      return next
    })
  }, [])

  const removeFromTeam = useCallback((index: number) => {
    setTeam((prev) => {
      const next = [...prev]
      next[index] = undefined
      return next
    })
  }, [])

  const saveTeam = async () => {
    if (!token) return
    setSaving(true)
    try {
      const ids = team.filter(Boolean).map((p) => p!.id)
      await collectionAPI.organizeTeam(token, ids)
      showToast('Equipe sauvegardee !', 'success')
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error')
    } finally {
      setSaving(false)
    }
  }

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
        <div>
          <Link href="/collection" className={styles.back}>&larr; Collection</Link>
          <h1 className={styles.title}>Mon Equipe</h1>
        </div>
        <button
          className={styles.saveBtn}
          onClick={saveTeam}
          disabled={saving}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className={styles.teamGrid}>
        {team.map((pokemon, index) => (
          <TeamSlot
            key={index}
            index={index}
            pokemon={pokemon}
            onRemove={pokemon ? () => removeFromTeam(index) : undefined}
          />
        ))}
      </div>

      {availablePokemon.length > 0 && (
        <>
          <h2 className={styles.subtitle}>Pokemon disponibles</h2>
          <div className={styles.availableGrid}>
            {availablePokemon.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                onClick={() => addToTeam(p)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
