'use client'

import { useEffect, useRef } from 'react'
import type { BattleLog as BattleLogType } from '@/lib/types'
import styles from './BattleLog.module.css'

interface BattleLogProps {
  logs: BattleLogType[]
}

export function BattleLog({ logs }: BattleLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Combat Log</h3>
      <div className={styles.list}>
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${styles.entry} ${styles[log.actor]} ${log.action === 'faint' ? styles.faint : ''}`}
          >
            <span className={styles.message}>{log.message}</span>
            {log.effectiveness && log.effectiveness !== 'normal' && (
              <span className={`${styles.effectiveness} ${styles[log.effectiveness]}`}>
                {log.effectiveness === 'super_effective' && "C'est super efficace !"}
                {log.effectiveness === 'not_very_effective' && "Ce n'est pas tres efficace..."}
                {log.effectiveness === 'no_effect' && "Ca n'a aucun effet..."}
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
