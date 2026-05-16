"use client"

import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import { Calculator } from "@/components/inner/calculator"
import { Search, Shield, Truck, Globe } from "lucide-react"

const regions = [
  { name: "Европа", code: "EU", flag: "🇪🇺" },
  { name: "США", code: "US", flag: "🇺🇸" },
  { name: "Азия", code: "ASIA", flag: "🌏" },
  { name: "Ближний Восток", code: "ME", flag: "🌍" },
]

const includes = [
  { 
    title: "Поиск", 
    description: "Профессиональный поиск по всем источникам",
    icon: Search
  },
  { 
    title: "Проверка", 
    description: "Аутентификация и фотоотчёт",
    icon: Shield
  },
  { 
    title: "Доставка", 
    description: "С отслеживанием на каждом этапе",
    icon: Truck
  }
]

export default function CalculatorPage() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-8 px-4 sm:px-6 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium mb-4">
            Калькулятор
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Расчёт стоимости
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Рассчитайте примерную стоимость поиска и доставки из любой точки мира
          </p>
        </div>
      </section>

      {/* Calculator */}
      <Calculator />

      {/* What's included */}
      <section className="py-12 px-4 sm:px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Что включено в стоимость
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {includes.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-card border border-border hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section ref={sectionRef} className="py-12 px-4 sm:px-6 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">Глобальное покрытие</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Доставляем из любого региона
            </h2>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {regions.map((region) => (
              <div
                key={region.name}
                className="p-4 rounded-xl bg-card border border-border hover:shadow-md hover:border-hover-border transition-all text-center"
              >
                <span className="text-3xl mb-2 block">{region.flag}</span>
                <span className="font-medium text-foreground block">{region.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{region.code}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center bg-card rounded-2xl border border-border p-6">
            {[
              { value: "10 000+", label: "заказов" },
              { value: "24ч", label: "ответ" },
              { value: "7 дней", label: "доставка" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
