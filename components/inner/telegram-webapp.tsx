'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
        setHeaderColor?: (color: string) => void
        setBackgroundColor?: (color: string) => void
      }
    }
  }
}

export function TelegramWebApp() {
  useEffect(() => {
    const app = window.Telegram?.WebApp
    if (!app) return

    app.ready()
    app.expand()
    app.setHeaderColor?.('#03060B')
    app.setBackgroundColor?.('#03060B')
  }, [])

  return null
}
