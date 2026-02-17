# 🔥 Pokémon Fight — Plan Projet

> Application Next.js 16 — Combat Pokémon tour par tour contre une IA (champion d'arène)
> Déployé sur Vercel via GitHub

---

## Stack Technique

| Élément | Choix |
|---------|-------|
| **Framework** | Next.js 16 (App Router, React 19, Turbopack) |
| **Styling** | Pure CSS (CSS Modules), dark theme moderne |
| **Auth** | JWT Bearer via API backend (proxy server-side) |
| **IA Champion** | OpenRouter (`OPENROUTER_API_KEY` + `MODEL_OPENROUTER`) |
| **Déploiement** | Vercel (auto-deploy GitHub) |
| **Typage** | TypeScript strict + `next typegen` pour les params async |

### Spécificités Next.js 16

- **Params/SearchParams asynchrones** : `await props.params` dans les pages dynamiques via `PageProps<'/path/[id]'>`
- **Middleware → Proxy** : utiliser `proxy.ts` au lieu de `middleware.ts`
- **Cache stable** : `cacheLife` et `cacheTag` importés directement depuis `next/cache` (plus de préfixe `unstable_`)
- **Runtime config** : `process.env` direct dans les Server Components, `NEXT_PUBLIC_` pour le client
- **next/legacy/image supprimé** : utiliser uniquement `next/image`
- **Turbopack par défaut** en dev

---

## Variables d'Environnement (Vercel)

```env
# API Backend
NEXT_PUBLIC_API_URL=https://your-api-url.com/api

# IA Champion (server-side uniquement)
OPENROUTER_API_KEY=sk-or-...
MODEL_OPENROUTER=google/gemini-2.0-flash-001
```

---

## Architecture des Pages

```
app/
├── layout.tsx                        # RootLayout : fonts, meta, AuthProvider
├── globals.css                       # Variables CSS, reset, dark theme
├── page.tsx                          # Landing page / redirect si connecté
│
├── (auth)/
│   └── login/
│       └── page.tsx                  # Formulaire signin / signup (toggle)
│
├── (app)/                            # Route group protégée (auth guard)
│   ├── layout.tsx                    # Navbar + sidebar + vérification JWT
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Profil dresseur (XP, badges, argent, niveau)
│   │
│   ├── pokedex/
│   │   ├── page.tsx                  # Grille de toutes les espèces
│   │   └── [id]/
│   │       └── page.tsx              # Détail espèce (stats, types, évolutions, attaques)
│   │
│   ├── collection/
│   │   ├── page.tsx                  # Tous mes Pokémon (grille + filtre)
│   │   └── team/
│   │       └── page.tsx              # Gestion équipe (6 slots, drag & drop)
│   │
│   ├── arenas/
│   │   ├── page.tsx                  # Liste des arènes + badges + champions
│   │   └── [id]/
│   │       └── battle/
│   │           └── page.tsx          # Écran de combat (core gameplay)
│   │
│   └── history/
│       └── page.tsx                  # Historique des combats passés
│
└── api/
    ├── auth/
    │   └── [...proxy]/
    │       └── route.ts              # Proxy serveur → API backend (signin/signup/me)
    └── ai/
        └── choose-action/
            └── route.ts              # Appel OpenRouter pour décision IA champion
```

---

## Composants

```
components/
│
├── auth/
│   ├── LoginForm.tsx                 # Formulaire de connexion
│   ├── SignupForm.tsx                # Formulaire d'inscription
│   └── AuthGuard.tsx                 # Wrapper de protection des routes
│
├── pokemon/
│   ├── PokemonCard.tsx               # Carte complète (sprite, HP, types, niveau)
│   ├── PokemonMiniCard.tsx           # Version compacte pour listes/grilles
│   ├── AttackButton.tsx              # Bouton d'attaque (couleur type, PP, puissance)
│   ├── TeamSlot.tsx                  # Slot d'équipe (vide ou occupé, draggable)
│   ├── TypeBadge.tsx                 # Badge de type Pokémon (feu, eau, etc.)
│   └── StatsDisplay.tsx              # Affichage des stats (barres ou radar CSS)
│
├── battle/
│   ├── BattleScene.tsx               # Scène principale (2 Pokémon face à face)
│   ├── BattleLog.tsx                 # Fil scrollable des actions du combat
│   ├── HPBar.tsx                     # Barre de vie animée (CSS transitions)
│   ├── AttackPanel.tsx               # Panel des 4 attaques du Pokémon actif
│   ├── PokemonSwitchModal.tsx        # Modal de switch de Pokémon
│   └── BattleResult.tsx              # Écran victoire / défaite + récompenses
│
├── ui/
│   ├── Navbar.tsx                    # Navigation principale
│   ├── Badge.tsx                     # Badge d'arène
│   ├── Modal.tsx                     # Modal générique
│   ├── Loader.tsx                    # Spinner / skeleton
│   └── Toast.tsx                     # Notifications
│
└── providers/
    └── AuthProvider.tsx              # Context React : JWT, user, login/logout
```

---

## Design System

### Palette — Dark Theme (no purple, no blue)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #1a1a1a;
  --bg-elevated: #222222;
  --bg-hover: #2a2a2a;

  /* Accents */
  --accent-primary: #e84033;        /* Rouge Pokéball */
  --accent-secondary: #f59e0b;      /* Or / Ambre */
  --accent-tertiary: #10b981;       /* Émeraude */
  --accent-success: #22c55e;
  --accent-danger: #ef4444;
  --accent-warning: #f97316;

  /* Text */
  --text-primary: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #525252;

  /* Borders */
  --border-default: #2a2a2a;
  --border-hover: #3a3a3a;
  --border-active: #e84033;

  /* Pokémon Type Colors */
  --type-fire: #f08030;
  --type-water: #6890f0;
  --type-grass: #78c850;
  --type-electric: #f8d030;
  --type-psychic: #f85888;
  --type-ghost: #705898;
  --type-dragon: #7038f8;
  --type-normal: #a8a878;
  --type-fighting: #c03028;
  --type-poison: #a040a0;
  --type-ground: #e0c068;
  --type-rock: #b8a038;
  --type-bug: #a8b820;
  --type-steel: #b8b8d0;
  --type-ice: #98d8d8;
  --type-dark: #705848;
  --type-fairy: #ee99ac;
  --type-flying: #a890f0;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.6);
}
```

### Principes UI

- **Dark-first** : fond très sombre, cartes légèrement relevées
- **Accents chauds** : rouge/or/émeraude, jamais de purple ou blue pour les éléments UI (les types Pokémon conservent leurs couleurs canoniques)
- **Animations CSS** : transitions fluides sur les HP bars, attaques, apparitions de cartes
- **Typographie** : sans-serif moderne, hiérarchie claire via taille et opacité
- **Responsive** : mobile-first, combat jouable sur mobile

---

## Gestion de l'Auth

### Flow

```
1. User → POST /api/auth/signin (via proxy Next.js)
   ← Reçoit { token, user }

2. Token JWT stocké dans AuthProvider (state React)
   + cookie httpOnly posé par la route API proxy pour persistence

3. Chaque requête API → Header "Authorization: Bearer <token>"

4. AuthGuard dans le layout (app) vérifie le token via GET /api/auth/me
   → Redirige vers /login si invalide
```

### Proxy API (route.ts)

Le proxy server-side permet de :
- Ne jamais exposer l'URL de l'API backend au client
- Gérer le cookie httpOnly côté serveur
- Ajouter le header Authorization automatiquement

---

## Flow de Combat (Core Gameplay)

### Initialisation

```
1. User choisit une arène → page /arenas/[id]/battle
2. POST /api/battles/start { arena_id }
   ← Reçoit : battle_id, équipe du joueur, équipe du champion
3. Affichage BattleScene avec les 2 premiers Pokémon actifs
```

### Boucle de Tour

```
TOUR DU JOUEUR :
├── AttackPanel affiche les 4 attaques du Pokémon actif
├── User clique une attaque (ou switch via PokemonSwitchModal)
├── POST /api/battles/:id/turn { action: "attack", attack_id }
└── Réception du log → animation dégâts, mise à jour HP bar

TOUR DE L'IA CHAMPION :
├── POST /api/ai/choose-action (route Next.js server-side)
│   ├── Envoie à OpenRouter :
│   │   - État du combat (HP actuels, types, statuts)
│   │   - Pokémon actif du champion + ses attaques disponibles
│   │   - Équipe restante du champion
│   └── IA répond : { action: "attack", attack_id } ou { action: "switch", pokemon_id }
├── POST /api/battles/:id/turn { action choisie par l'IA }
└── Réception du log → animation dégâts, mise à jour HP bar

RÉPÉTER jusqu'à KO complet d'une équipe
```

### Fin de Combat

```
1. Détection victoire/défaite via les logs
2. Affichage BattleResult :
   - XP gagné
   - Badge obtenu (si victoire arène)
   - Argent gagné
3. Redirection vers dashboard ou arenas
```

---

## Route IA — `/api/ai/choose-action`

```typescript
// app/api/ai/choose-action/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { battleState } = await req.json()

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.MODEL_OPENROUTER,
      messages: [
        {
          role: 'system',
          content: `Tu es un champion d'arène Pokémon. Analyse l'état du combat et choisis la meilleure action.
Réponds UNIQUEMENT en JSON : { "action": "attack", "attack_id": number } ou { "action": "switch", "pokemon_id": number }.
Sois stratégique : exploite les faiblesses de type, gère tes HP, switch si désavantagé.`
        },
        {
          role: 'user',
          content: JSON.stringify(battleState)
        }
      ],
      response_format: { type: 'json_object' }
    })
  })

  const data = await response.json()
  const action = JSON.parse(data.choices[0].message.content)

  return NextResponse.json(action)
}
```

---

## API Endpoints Consommés

### Auth & Profil

| Méthode | Endpoint | Usage |
|---------|----------|-------|
| POST | `/api/auth/signup` | Inscription |
| POST | `/api/auth/signin` | Connexion → JWT |
| GET | `/api/auth/me` | Vérification token + infos user |
| GET | `/api/profile` | Profil dresseur (XP, badges, argent) |
| PATCH | `/api/profile` | Mise à jour avatar / nom dresseur |

### Pokédex

| Méthode | Endpoint | Usage |
|---------|----------|-------|
| GET | `/api/species` | Liste toutes les espèces |
| GET | `/api/species/:id` | Détail espèce (stats, évolutions) |
| GET | `/api/attacks/:id` | Attaques d'un Pokémon |

### Collection & Équipe

| Méthode | Endpoint | Usage |
|---------|----------|-------|
| GET | `/api/my-pokemon` | Tous mes Pokémon |
| GET | `/api/my-pokemon/team` | Équipe active (6 max) |
| POST | `/api/my-pokemon/organize` | Réorganiser l'équipe |

### Combat

| Méthode | Endpoint | Usage |
|---------|----------|-------|
| GET | `/api/arenas` | Liste arènes + champions |
| POST | `/api/battles/start` | Lancer un combat |
| POST | `/api/battles/:id/turn` | Envoyer une action (tour) |
| GET | `/api/battles/:id/history` | Historique logs d'un combat |

---

## Phases d'Implémentation

### Phase 1 — Fondation
- [ ] Init projet Next.js 16, structure dossiers
- [ ] `globals.css` : variables, reset, dark theme
- [ ] `AuthProvider` : context JWT, login/logout, persistence cookie
- [ ] Routes proxy API (`/api/auth/[...proxy]`)
- [ ] Page login : formulaires signin/signup avec toggle
- [ ] `AuthGuard` dans le layout `(app)`

### Phase 2 — Navigation & Profil
- [ ] Layout `(app)` : Navbar avec navigation
- [ ] Page dashboard : affichage profil dresseur
- [ ] Composants `Badge`, `Loader`
- [ ] PATCH profil (avatar, trainer_name)

### Phase 3 — Pokédex
- [ ] Page `/pokedex` : grille d'espèces avec sprites
- [ ] Page `/pokedex/[id]` : détail (stats, types, évolutions, attaques)
- [ ] Composants `PokemonCard`, `TypeBadge`, `StatsDisplay`

### Phase 4 — Collection & Équipe
- [ ] Page `/collection` : grille de mes Pokémon
- [ ] Page `/collection/team` : 6 slots d'équipe
- [ ] Drag & drop ou sélection pour organiser l'équipe
- [ ] POST `/my-pokemon/organize`

### Phase 5 — Arènes
- [ ] Page `/arenas` : liste des arènes avec badges et champions
- [ ] UI de sélection d'arène avant combat

### Phase 6 — Combat (Core)
- [ ] Page `/arenas/[id]/battle` : BattleScene
- [ ] `HPBar` animée, `AttackPanel` (4 attaques cliquables)
- [ ] Boucle de tour : joueur → IA → joueur
- [ ] Route `/api/ai/choose-action` : intégration OpenRouter
- [ ] `PokemonSwitchModal` pour changer de Pokémon
- [ ] `BattleLog` : fil des actions
- [ ] `BattleResult` : écran fin de combat

### Phase 7 — Polish
- [ ] Page `/history` : historique des combats
- [ ] Animations CSS : transitions d'attaque, shake dégâts, fade KO
- [ ] Responsive mobile
- [ ] Gestion des erreurs et edge cases
- [ ] SEO et meta tags

---

## Structure Fichiers Finale

```
pokemon-fight/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── page.module.css
│   ├── (auth)/
│   │   └── login/
│   │       ├── page.tsx
│   │       └── page.module.css
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── pokedex/
│   │   ├── collection/
│   │   ├── arenas/
│   │   └── history/
│   └── api/
│       ├── auth/[...proxy]/route.ts
│       └── ai/choose-action/route.ts
├── components/
│   ├── auth/
│   ├── pokemon/
│   ├── battle/
│   ├── ui/
│   └── providers/
├── lib/
│   ├── api.ts                  # Fetch wrapper avec JWT auto
│   ├── types.ts                # Types TypeScript (Pokemon, Battle, etc.)
│   └── constants.ts            # Constantes (type colors, etc.)
├── public/
│   └── sprites/                # Si sprites locaux
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local
```
