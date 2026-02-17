import type { User, Profile, Species, Pokemon, Arena, Battle, BattleAction, BattleHistoryEntry, BattleState } from './types'

const API_BASE = '/api'

interface FetchOptions extends RequestInit {
  token?: string
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...rest,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new APIError(
      (errorBody as { message?: string }).message || `Request failed with status ${res.status}`,
      res.status,
      errorBody
    )
  }

  return res.json() as Promise<T>
}

/* ===== Auth ===== */
export const authAPI = {
  signin: (email: string, password: string) =>
    fetchAPI<{ token: string; user: User }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, username: string) =>
    fetchAPI<{ token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    }),

  me: (token: string) =>
    fetchAPI<{ user: User }>('/auth/me', { token }),
}

/* ===== Profile ===== */
export const profileAPI = {
  get: (token: string) =>
    fetchAPI<Profile>('/auth/profile', { token }),

  update: (token: string, data: { trainer_name?: string; avatar?: string }) =>
    fetchAPI<Profile>('/auth/profile', {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    }),
}

/* ===== Pokedex ===== */
export const pokedexAPI = {
  listSpecies: (token: string) =>
    fetchAPI<Species[]>('/auth/species', { token }),

  getSpecies: (token: string, id: number) =>
    fetchAPI<Species>(`/auth/species/${id}`, { token }),
}

/* ===== Collection ===== */
export const collectionAPI = {
  getMyPokemon: (token: string) =>
    fetchAPI<Pokemon[]>('/auth/my-pokemon', { token }),

  getTeam: (token: string) =>
    fetchAPI<Pokemon[]>('/auth/my-pokemon/team', { token }),

  organizeTeam: (token: string, pokemonIds: number[]) =>
    fetchAPI<{ success: boolean }>('/auth/my-pokemon/organize', {
      method: 'POST',
      token,
      body: JSON.stringify({ pokemon_ids: pokemonIds }),
    }),
}

/* ===== Arenas ===== */
export const arenaAPI = {
  list: (token: string) =>
    fetchAPI<Arena[]>('/auth/arenas', { token }),
}

/* ===== Battle ===== */
export const battleAPI = {
  start: (token: string, arenaId: number) =>
    fetchAPI<Battle>('/auth/battles/start', {
      method: 'POST',
      token,
      body: JSON.stringify({ arena_id: arenaId }),
    }),

  sendAction: (token: string, battleId: number, action: BattleAction) =>
    fetchAPI<Battle>(`/auth/battles/${battleId}/turn`, {
      method: 'POST',
      token,
      body: JSON.stringify(action),
    }),

  getHistory: (token: string) =>
    fetchAPI<BattleHistoryEntry[]>('/auth/battles/history', { token }),
}

/* ===== AI ===== */
export const aiAPI = {
  chooseAction: (battleState: BattleState) =>
    fetchAPI<BattleAction>('/ai/choose-action', {
      method: 'POST',
      body: JSON.stringify({ battleState }),
    }),
}
