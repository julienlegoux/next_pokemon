'use client'

import type { Pokemon } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import { PokemonCard } from '@/components/pokemon/PokemonCard'
import styles from './PokemonSwitchModal.module.css'

interface PokemonSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  team: Pokemon[]
  activeIndex: number
  onSwitch: (pokemonId: number) => void
}

export function PokemonSwitchModal({
  isOpen,
  onClose,
  team,
  activeIndex,
  onSwitch,
}: PokemonSwitchModalProps) {
  const available = team.filter((p, i) => i !== activeIndex && p.current_hp > 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Changer de Pokemon">
      {available.length === 0 ? (
        <p className={styles.empty}>Aucun Pokemon disponible</p>
      ) : (
        <div className={styles.grid}>
          {available.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => {
                onSwitch(pokemon.id)
                onClose()
              }}
            />
          ))}
        </div>
      )}
    </Modal>
  )
}
