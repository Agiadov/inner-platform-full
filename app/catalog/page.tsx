"use client"

import { FormEvent, useState } from "react"
import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import Link from "next/link"
import { Search, Package } from "lucide-react"

type Item = { id: string; title?: string; images?: string[] }
type SearchResponse = { ok: boolean; items?: Item[]; error?: string }

export default function CatalogPage() {
  const [query, setQuery] = useState("New Balance 530")
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function runSearch(event?: FormEvent) {
    event?.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/poizon/search?q=${encodeURIComponent(q)}&limit=20`, { cache: "no-store" })
      const json: SearchResponse = await response.json()
      if (!json.ok) throw new Error(json.error || "Не удалось выполнить поиск")
      setItems(json.items ?? [])
    } catch (err) {
      setItems([])
      setError(err instanceof Error ? err.message : "Ошибка поиска")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-8 bg-secondary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium mb-4">Poizon China</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Живой каталог</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Ищи товар по названию. В карточке доступны размеры, наличие и финальная цена INNER в рублях.</p>
          </div>

          <form onSubmit={runSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Например: New Balance 530"
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
              />
            </div>
            <button disabled={loading} className="px-7 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-50">
              {loading ? "Ищем…" : "Найти"}
            </button>
          </form>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          {error ? <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500">{error}</div> : null}

          {!loading && !error && items.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-placeholder mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">Найди нужный товар</p>
              <p className="text-muted-foreground">Попробуй New Balance 530, ASICS Kayano 14 или Salomon XT-6</p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <Link key={item.id} href={`/product/${encodeURIComponent(item.id)}`} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-hover-border transition-all">
                <div className="aspect-square bg-white overflow-hidden flex items-center justify-center">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title ?? item.id} className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300" />
                  ) : (
                    <span className="text-muted-foreground text-sm">Нет фото</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[11px] uppercase tracking-[.12em] text-primary font-semibold mb-2">Poizon China</div>
                  <h3 className="text-sm font-semibold text-foreground leading-5 line-clamp-3 min-h-[60px]">{item.title || "Товар Poizon"}</h3>
                  <div className="mt-4 text-sm text-muted-foreground">Открыть товар →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
