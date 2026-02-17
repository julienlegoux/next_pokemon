import type { PokemonType } from './types'

export const TYPE_COLORS: Record<PokemonType, string> = {
  fire: 'var(--type-fire)',
  water: 'var(--type-water)',
  grass: 'var(--type-grass)',
  electric: 'var(--type-electric)',
  psychic: 'var(--type-psychic)',
  ghost: 'var(--type-ghost)',
  dragon: 'var(--type-dragon)',
  normal: 'var(--type-normal)',
  fighting: 'var(--type-fighting)',
  poison: 'var(--type-poison)',
  ground: 'var(--type-ground)',
  rock: 'var(--type-rock)',
  bug: 'var(--type-bug)',
  steel: 'var(--type-steel)',
  ice: 'var(--type-ice)',
  dark: 'var(--type-dark)',
  fairy: 'var(--type-fairy)',
  flying: 'var(--type-flying)',
}

export const TYPE_LABELS: Record<PokemonType, string> = {
  fire: 'Feu',
  water: 'Eau',
  grass: 'Plante',
  electric: 'Electrik',
  psychic: 'Psy',
  ghost: 'Spectre',
  dragon: 'Dragon',
  normal: 'Normal',
  fighting: 'Combat',
  poison: 'Poison',
  ground: 'Sol',
  rock: 'Roche',
  bug: 'Insecte',
  steel: 'Acier',
  ice: 'Glace',
  dark: 'Tenebres',
  fairy: 'Fee',
  flying: 'Vol',
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'PV',
  attack: 'Attaque',
  defense: 'Defense',
  special_attack: 'Atq. Spe.',
  special_defense: 'Def. Spe.',
  speed: 'Vitesse',
}

export const MAX_TEAM_SIZE = 6
