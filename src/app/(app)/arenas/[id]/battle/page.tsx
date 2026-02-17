'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { battleAPI, aiAPI } from '@/lib/api'
import type { Battle, BattleState } from '@/lib/types'
import { BattleScene } from '@/components/battle/BattleScene'
import { AttackPanel } from '@/components/battle/AttackPanel'
import { BattleLog } from '@/components/battle/BattleLog'
import { PokemonSwitchModal } from '@/components/battle/PokemonSwitchModal'
import { BattleResult } from '@/components/battle/BattleResult'
import { Loader } from '@/components/ui/Loader'
import styles from './page.module.css'

export default function BattlePage() {
  const { token } = useAuth()
  const params = useParams()
  const arenaId = Number(params.id)

  const [battle, setBattle] = useState<Battle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSwitch, setShowSwitch] = useState(false)

  // Start battle
  useEffect(() => {
    if (!token || !arenaId) return
    battleAPI.start(token, arenaId)
      .then((b) => {
        setBattle(b)
        setIsPlayerTurn(true)
      })
      .catch((err) => setError(err.message || 'Impossible de lancer le combat'))
      .finally(() => setLoading(false))
  }, [token, arenaId])

  // Player attack
  const handleAttack = useCallback(async (attackId: number) => {
    if (!token || !battle || !isPlayerTurn || isAnimating) return

    setIsAnimating(true)
    setIsPlayerTurn(false)

    try {
      // Player turn
      const afterPlayer = await battleAPI.sendAction(token, battle.id, {
        action: 'attack',
        attack_id: attackId,
      })
      setBattle(afterPlayer)

      // Wait for animation
      await new Promise((r) => setTimeout(r, 800))

      // Check if battle ended after player turn
      if (afterPlayer.status !== 'ongoing') {
        setIsAnimating(false)
        return
      }

      // Champion AI turn
      const activePokemon = afterPlayer.champion_team[afterPlayer.active_champion_pokemon_index]
      const playerActive = afterPlayer.player_team[afterPlayer.active_player_pokemon_index]

      const battleState: BattleState = {
        champion_active_pokemon: {
          name: activePokemon.species.name,
          types: activePokemon.species.types,
          current_hp: activePokemon.current_hp,
          max_hp: activePokemon.max_hp,
          attacks: activePokemon.attacks.map((a) => ({
            id: a.id,
            name: a.name,
            type: a.type,
            power: a.power,
            pp: a.current_pp ?? a.pp,
          })),
        },
        player_active_pokemon: {
          name: playerActive.species.name,
          types: playerActive.species.types,
          current_hp: playerActive.current_hp,
          max_hp: playerActive.max_hp,
        },
        champion_remaining_team: afterPlayer.champion_team
          .filter((p, i) => i !== afterPlayer.active_champion_pokemon_index && p.current_hp > 0)
          .map((p) => ({
            id: p.id,
            name: p.species.name,
            types: p.species.types,
            current_hp: p.current_hp,
            max_hp: p.max_hp,
          })),
      }

      const aiAction = await aiAPI.chooseAction(battleState)

      // Champion turn
      const afterChampion = await battleAPI.sendAction(token, battle.id, aiAction)
      setBattle(afterChampion)

      await new Promise((r) => setTimeout(r, 800))

      if (afterChampion.status === 'ongoing') {
        setIsPlayerTurn(true)
      }
    } catch {
      setError('Erreur durant le combat')
    } finally {
      setIsAnimating(false)
    }
  }, [token, battle, isPlayerTurn, isAnimating])

  // Player switch
  const handleSwitch = useCallback(async (pokemonId: number) => {
    if (!token || !battle) return

    setIsAnimating(true)
    setIsPlayerTurn(false)

    try {
      const afterSwitch = await battleAPI.sendAction(token, battle.id, {
        action: 'switch',
        pokemon_id: pokemonId,
      })
      setBattle(afterSwitch)

      await new Promise((r) => setTimeout(r, 500))

      if (afterSwitch.status === 'ongoing') {
        // Champion still plays after a switch
        const activePokemon = afterSwitch.champion_team[afterSwitch.active_champion_pokemon_index]
        const playerActive = afterSwitch.player_team[afterSwitch.active_player_pokemon_index]

        const battleState: BattleState = {
          champion_active_pokemon: {
            name: activePokemon.species.name,
            types: activePokemon.species.types,
            current_hp: activePokemon.current_hp,
            max_hp: activePokemon.max_hp,
            attacks: activePokemon.attacks.map((a) => ({
              id: a.id,
              name: a.name,
              type: a.type,
              power: a.power,
              pp: a.current_pp ?? a.pp,
            })),
          },
          player_active_pokemon: {
            name: playerActive.species.name,
            types: playerActive.species.types,
            current_hp: playerActive.current_hp,
            max_hp: playerActive.max_hp,
          },
          champion_remaining_team: afterSwitch.champion_team
            .filter((p, i) => i !== afterSwitch.active_champion_pokemon_index && p.current_hp > 0)
            .map((p) => ({
              id: p.id,
              name: p.species.name,
              types: p.species.types,
              current_hp: p.current_hp,
              max_hp: p.max_hp,
            })),
        }

        const aiAction = await aiAPI.chooseAction(battleState)
        const afterChampion = await battleAPI.sendAction(token, battle.id, aiAction)
        setBattle(afterChampion)

        await new Promise((r) => setTimeout(r, 800))

        if (afterChampion.status === 'ongoing') {
          setIsPlayerTurn(true)
        }
      }
    } catch {
      setError('Erreur durant le switch')
    } finally {
      setIsAnimating(false)
    }
  }, [token, battle])

  if (loading) {
    return (
      <div className={styles.center}>
        <Loader size={50} />
        <p className={styles.loadingText}>Preparation du combat...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  if (!battle) return null

  const playerPokemon = battle.player_team[battle.active_player_pokemon_index]

  return (
    <div className={styles.page}>
      <BattleScene
        battle={battle}
        isPlayerTurn={isPlayerTurn}
        isAnimating={isAnimating}
      />

      <div className={styles.controls}>
        <div className={styles.attackSection}>
          {battle.status === 'ongoing' && playerPokemon && (
            <AttackPanel
              attacks={playerPokemon.attacks}
              onAttack={handleAttack}
              onSwitch={() => setShowSwitch(true)}
              disabled={!isPlayerTurn || isAnimating}
            />
          )}
        </div>
        <div className={styles.logSection}>
          <BattleLog logs={battle.logs} />
        </div>
      </div>

      <PokemonSwitchModal
        isOpen={showSwitch}
        onClose={() => setShowSwitch(false)}
        team={battle.player_team}
        activeIndex={battle.active_player_pokemon_index}
        onSwitch={handleSwitch}
      />

      {battle.status !== 'ongoing' && (
        <BattleResult
          result={battle.status}
          rewards={battle.rewards}
        />
      )}
    </div>
  )
}
