'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { authAPI, APIError } from '@/lib/api'
import styles from './LoginForm.module.css'

function extractErrorMessage(err: unknown): string {
  if (!(err instanceof APIError) || !err.body) {
    return err instanceof Error ? err.message : 'Une erreur est survenue'
  }

  const body = err.body as Record<string, unknown>
  const errors = body.errors
  if (!errors) return err.message

  // Array format: [{ message: "..." }] or ["msg"]
  if (Array.isArray(errors)) {
    return errors
      .map((e: unknown) => {
        if (typeof e === 'string') return e
        const msg = (e as Record<string, unknown>).message
        return typeof msg === 'string' ? msg : ''
      })
      .filter(Boolean)
      .join('. ') || err.message
  }

  // Object format: { field: ["msg"] }
  if (typeof errors === 'object') {
    return Object.values(errors as Record<string, string[]>)
      .flat()
      .map(String)
      .join('. ') || err.message
  }

  return err.message
}

export function LoginForm() {
  const { login } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [trainerName, setTrainerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        const { token, user } = await authAPI.signup(email, password, trainerName)
        login(token, user)
      } else {
        const { token, user } = await authAPI.signin(email, password)
        login(token, user)
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Pokemon Fight</h1>
          <p className={styles.subtitle}>
            {isSignup ? 'Cree ton compte dresseur' : 'Connecte-toi pour combattre'}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${!isSignup ? styles.tabActive : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Connexion
          </button>
          <button
            className={`${styles.tab} ${isSignup ? styles.tabActive : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignup && (
            <div className={styles.field}>
              <label htmlFor="trainerName" className={styles.label}>Nom de dresseur</label>
              <input
                id="trainerName"
                type="text"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                className={styles.input}
                placeholder="Sacha"
                required
                minLength={3}
                maxLength={30}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="dresseur@pokemon.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Chargement...' : isSignup ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
