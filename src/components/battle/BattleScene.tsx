'use client'

import type { Battle } from '@/lib/types'
import { HPBar } from './HPBar'
import { TypeBadge } from '@/components/pokemon/TypeBadge'
import styles from './BattleScene.module.css'

interface BattleSceneProps {
  battle: Battle
  isPlayerTurn: boolean
  isAnimating: boolean
}

export function BattleScene({ battle, isPlayerTurn, isAnimating }: BattleSceneProps) {
  const playerPokemon = battle.player_team[battle.active_player_pokemon_index]
  const championPokemon = battle.champion_team[battle.active_champion_pokemon_index]

  if (!playerPokemon || !championPokemon) return null

  return (
    <div className={styles.scene}>
      {/* Champion side (top) */}
      <div className={styles.championSide}>
        <div className={styles.pokemonInfo}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{championPokemon.species.name}</span>
            <span className={styles.level}>Nv.{championPokemon.level}</span>
          </div>
          <div className={styles.types}>
            {championPokemon.species.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
          <HPBar
            current={championPokemon.current_hp}
            max={championPokemon.max_hp}
            label="PV"
          />
        </div>
        <div className={`${styles.spriteContainer} ${styles.championSprite} ${isAnimating && !isPlayerTurn ? styles.shake : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={championPokemon.species.sprite_url}
            alt={championPokemon.species.name}
            className={styles.sprite}
            width={120}
            height={120}
          />
        </div>
      </div>

      {/* Player side (bottom) */}
      <div className={styles.playerSide}>
        <div className={`${styles.spriteContainer} ${styles.playerSprite} ${isAnimating && isPlayerTurn ? styles.attack : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={playerPokemon.species.sprite_back_url || playerPokemon.species.sprite_url}
            alt={playerPokemon.species.name}
            className={styles.sprite}
            width={120}
            height={120}
          />
        </div>
        <div className={styles.pokemonInfo}>
          <div className={styles.nameRow}>
            <span className={styles.name}>
              {playerPokemon.nickname || playerPokemon.species.name}
            </span>
            <span className={styles.level}>Nv.{playerPokemon.level}</span>
          </div>
          <div className={styles.types}>
            {playerPokemon.species.types.map((t) => (
              <TypeBadge key={t} type={t} size="sm" />
            ))}
          </div>
          <HPBar
            current={playerPokemon.current_hp}
            max={playerPokemon.max_hp}
            label="PV"
          />
        </div>
      </div>

      {/* Team indicators */}
      <div className={styles.teamIndicators}>
        <div className={styles.indicator}>
          {battle.champion_team.map((p, i) => (
            <span
              key={i}
              className={`${styles.dot} ${p.current_hp > 0 ? styles.dotAlive : styles.dotFainted}`}
            />
          ))}
        </div>
        <div className={styles.indicator}>
          {battle.player_team.map((p, i) => (
            <span
              key={i}
              className={`${styles.dot} ${p.current_hp > 0 ? styles.dotAlive : styles.dotFainted}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
