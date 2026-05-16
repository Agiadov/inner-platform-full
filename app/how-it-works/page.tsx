"use client"

import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import Link from "next/link"
import { Camera, Search, CreditCard, Package, ArrowRight, Shield, Globe, User, Calculator } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Отправьте фото",
    description: "Загрузите фотографию вещи — скриншот из Instagram, Pinterest или фото с подиума.",
    icon: Camera
  },
  {
    number: "02",
    title: "Мы ищем",
    description: "Используем продвинутые методы поиска и базу контактов для нахождения вещи.",
    icon: Search
  },
  {
    number: "03",
    title: "Согласование",
    description: "Отправляем варианты с ценами и ссылками. Вы выбираете подходящий.",
    icon: CreditCard
  },
  {
    number: "04",
    title: "Доставка",
    description: "Оформляем заказ и организуем доставку. Получаете вещь без хлопот.",
    icon: Package
  }
]

const advantages = [
  { title: "Поиск по фото", icon: Search },
  { title: "Редкие коллекции", icon: Package },
  { title: "Проверка подлинности", icon: Shield },
  { title: "Персональный менеджер", icon: User },
  { title: "Доставка по миру", icon: Globe },
  { title: "Честные цены", icon: Calculator },
]

export default function HowItWorksPage() {
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
            Процесс
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Как это работает
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            4 простых шага к вещи вашей мечты
          </p>
        </div>
      </section>

      {/* Steps */}
      <section ref={sectionRef} className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-hover-border transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-muted-foreground">Шаг {step.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 px-4 sm:px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Почему мы
            </h2>
            <p className="text-muted-foreground">
              Преимущества нашего сервиса
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-md hover:border-hover-border transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <advantage.icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{advantage.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Готовы начать?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Отправьте фото вещи и получите расчёт стоимости
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 bg-card text-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-background transition-all"
          >
            Создать заявку
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
