/* ===== Auth ===== */
export interface User {
  id: number
  email: string
  trainer_name: string
  avatar?: string
  xp: number
  level: number
  money: number
  badges: Badge[]
}

export interface AuthResponse {
  token: string
  user: User
}

/* ===== Pokemon ===== */
export type PokemonType =
  | 'fire' | 'water' | 'grass' | 'electric'
  | 'psychic' | 'ghost' | 'dragon' | 'normal'
  | 'fighting' | 'poison' | 'ground' | 'rock'
  | 'bug' | 'steel' | 'ice' | 'dark'
  | 'fairy' | 'flying'

export interface Species {
  id: number
  name: string
  types: PokemonType[]
  base_stats: Stats
  sprite_url: string
  sprite_back_url?: string
  evolutions?: Evolution[]
  attacks?: Attack[]
  description?: string
  height?: number
  weight?: number
}

export interface Stats {
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
}

export interface Evolution {
  from_species_id: number
  to_species_id: number
  to_species_name: string
  level_required: number
}

export interface Attack {
  id: number
  name: string
  type: PokemonType
  power: number
  accuracy: number
  pp: number
  current_pp?: number
  category: 'physical' | 'special' | 'status'
  description?: string
}

export interface Pokemon {
  id: number
  species_id: number
  species: Species
  nickname?: string
  level: number
  current_hp: number
  max_hp: number
  xp: number
  attacks: Attack[]
  stats: Stats
  is_in_team: boolean
  team_position?: number
}

/* ===== Arena & Battle ===== */
export interface Badge {
  id: number
  name: string
  arena_id: number
  image_url?: string
}

export interface Arena {
  id: number
  name: string
  badge: Badge
  champion_name: string
  champion_sprite?: string
  champion_team: Pokemon[]
  type_specialty: PokemonType
  difficulty: number
  is_defeated: boolean
}

export interface Battle {
  id: number
  arena_id: number
  status: 'ongoing' | 'won' | 'lost'
  player_team: Pokemon[]
  champion_team: Pokemon[]
  active_player_pokemon_index: number
  active_champion_pokemon_index: number
  logs: BattleLog[]
  rewards?: BattleRewards
}

export interface BattleLog {
  turn: number
  actor: 'player' | 'champion'
  action: 'attack' | 'switch' | 'faint' | 'info'
  message: string
  damage?: number
  attack_name?: string
  effectiveness?: 'super_effective' | 'not_very_effective' | 'no_effect' | 'normal'
}

export interface BattleRewards {
  xp_gained: number
  money_gained: number
  badge?: Badge
}

export interface BattleAction {
  action: 'attack' | 'switch'
  attack_id?: number
  pokemon_id?: number
}

/* ===== AI ===== */
export interface BattleState {
  champion_active_pokemon: {
    name: string
    types: PokemonType[]
    current_hp: number
    max_hp: number
    attacks: { id: number; name: string; type: PokemonType; power: number; pp: number }[]
  }
  player_active_pokemon: {
    name: string
    types: PokemonType[]
    current_hp: number
    max_hp: number
  }
  champion_remaining_team: {
    id: number
    name: string
    types: PokemonType[]
    current_hp: number
    max_hp: number
  }[]
}

/* ===== Profile ===== */
export interface Profile {
  id: number
  trainer_name: string
  avatar?: string
  xp: number
  level: number
  money: number
  badges: Badge[]
  pokemon_count: number
  battles_won: number
  battles_lost: number
}

/* ===== Battle History ===== */
export interface BattleHistoryEntry {
  id: number
  arena_name: string
  champion_name: string
  result: 'won' | 'lost'
  date: string
  xp_gained: number
  money_gained: number
  turns: number
}
