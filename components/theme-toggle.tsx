"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "graphite">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("inner_theme") as "light" | "graphite" | null
    const nextTheme = savedTheme === "graphite" ? "graphite" : "light"

    setTheme(nextTheme)
    document.documentElement.classList.toggle("graphite", nextTheme === "graphite")
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "graphite" : "light"

    setTheme(nextTheme)
    localStorage.setItem("inner_theme", nextTheme)
    document.documentElement.classList.toggle("graphite", nextTheme === "graphite")
  }

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card text-foreground px-3 py-2 text-sm transition-colors hover:bg-secondary"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      {theme === "light" ? "Графитовая" : "Светлая"}
    </button>
  )
}
