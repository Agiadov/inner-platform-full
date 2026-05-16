"use client"

import { useState } from "react"
import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import Image from "next/image"
import Link from "next/link"
import { Search, ArrowRight, Clock, Check, Truck, Package } from "lucide-react"

const categories = [
  { name: "Все", count: 12 },
  { name: "Кроссовки", count: 5 },
  { name: "Одежда", count: 4 },
  { name: "Сумки", count: 2 },
  { name: "Аксессуары", count: 1 },
]

const cases = [
  {
    id: 1,
    name: "Stone Island Jacket",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
    priceRu: "89 000",
    priceInner: "46 000",
    savings: 48,
    delivery: "7 дней",
    status: "delivered",
    category: "Одежда",
  },
  {
    id: 2,
    name: "Nike Dunk Low Retro",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop",
    priceRu: "18 990",
    priceInner: "11 500",
    savings: 39,
    delivery: "10 дней",
    status: "delivered",
    category: "Кроссовки",
  },
  {
    id: 3,
    name: "Prada Re-Nylon Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    priceRu: "165 000",
    priceInner: "95 000",
    savings: 42,
    delivery: "12 дней",
    status: "shipping",
    category: "Сумки",
  },
  {
    id: 4,
    name: "New Balance 1906R",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop",
    priceRu: "24 990",
    priceInner: "14 200",
    savings: 43,
    delivery: "8 дней",
    status: "delivered",
    category: "Кроссовки",
  },
  {
    id: 5,
    name: "Acne Studios Scarf",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop",
    priceRu: "32 000",
    priceInner: "18 500",
    savings: 42,
    delivery: "9 дней",
    status: "delivered",
    category: "Аксессуары",
  },
  {
    id: 6,
    name: "Jordan 1 Retro High",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    priceRu: "28 990",
    priceInner: "16 800",
    savings: 42,
    delivery: "11 дней",
    status: "searching",
    category: "Кроссовки",
  },
  {
    id: 7,
    name: "Off-White Belt",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    priceRu: "45 000",
    priceInner: "27 000",
    savings: 40,
    delivery: "7 дней",
    status: "delivered",
    category: "Аксессуары",
  },
  {
    id: 8,
    name: "Balenciaga Triple S",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
    priceRu: "95 000",
    priceInner: "58 000",
    savings: 39,
    delivery: "14 дней",
    status: "delivered",
    category: "Кроссовки",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium rounded-full">
          <Check className="w-3 h-3" />
          Доставлено
        </span>
      )
    case "shipping":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-medium rounded-full">
          <Truck className="w-3 h-3" />
          В пути
        </span>
      )
    case "searching":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium rounded-full">
          <Clock className="w-3 h-3" />
          В поиске
        </span>
      )
    default:
      return null
  }
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Все")

  const filteredCases = cases.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "Все" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-8 bg-secondary">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium mb-4">
              Кейсы
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Недавние находки
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Реальные примеры заказов наших клиентов с экономией и сроками доставки
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-hover-border"
                }`}
              >
                {cat.name}
                <span className={`text-xs ${activeCategory === cat.name ? "text-primary-foreground/60" : "text-placeholder"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          {filteredCases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCases.map((item) => (
                <div
                  key={item.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-hover-border transition-all"
                >
                  <div className="relative aspect-square bg-secondary overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3 truncate">{item.name}</h3>
                    
                    {/* Prices */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Цена в РФ</span>
                        <span className="text-muted-foreground line-through">{item.priceRu} ₽</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">Через INNER</span>
                        <span className="text-foreground font-semibold">{item.priceInner} ₽</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mb-4 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-[#16A34A] bg-[#16A34A]/10 px-2 py-1 rounded-md">
                          −{item.savings}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {item.delivery}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/request"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-background hover:bg-secondary text-foreground rounded-xl text-sm font-medium transition-colors"
                    >
                      Хочу похожую вещь
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-placeholder mx-auto mb-4" />
              <p className="text-muted-foreground">Кейсы не найдены</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Хотите найти что-то конкретное?
          </h2>
          <p className="text-primary-foreground/70 mb-8">
            Отправьте фото или ссылку, и мы найдём товар для вас
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 bg-card text-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-background transition-all"
          >
            Отправить заявку
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
