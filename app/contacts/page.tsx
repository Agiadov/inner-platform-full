"use client"

import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import Link from "next/link"
import { useState } from "react"
import { Send, Mail, Instagram, Clock, MapPin, Check } from "lucide-react"

const contacts = [
  {
    label: "Telegram",
    value: "@innerlabel",
    href: "https://t.me/innerlabel",
    description: "Самый быстрый способ",
    icon: Send
  },
  {
    label: "Email",
    value: "hello@innerlabel.ru",
    href: "mailto:hello@innerlabel.ru",
    description: "Официальные запросы",
    icon: Mail
  },
  {
    label: "Instagram",
    value: "@innerlabel",
    href: "https://instagram.com/innerlabel",
    description: "Новинки и находки",
    icon: Instagram
  }
]

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-8 px-4 sm:px-6 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium mb-4">
            Контакты
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Связаться с нами
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Ответим в течение часа в любое время
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <Link
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-hover-border transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <contact.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{contact.label}</div>
                <div className="text-lg text-foreground font-semibold mb-1 group-hover:text-muted-foreground transition-colors">{contact.value}</div>
                <div className="text-sm text-muted-foreground">{contact.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 px-4 sm:px-6 bg-secondary">
        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-2">Напишите нам</h2>
            <p className="text-muted-foreground mb-6 text-sm">Заполните форму и мы свяжемся с вами</p>

            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#16A34A]" />
                </div>
                <div className="text-xl font-semibold text-foreground mb-2">Отправлено</div>
                <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Имя</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-card-soft border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
                    placeholder="Как к вам обращаться?"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-card-soft border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Сообщение</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-card-soft border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all resize-none"
                    placeholder="Что вы ищете?"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    "Отправить"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4 bg-card rounded-2xl border border-border p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-5 h-5 text-foreground" />
              <div className="text-sm text-muted-foreground">Локация</div>
              <div className="font-semibold text-foreground">Moscow, Russia</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-5 h-5 text-foreground" />
              <div className="text-sm text-muted-foreground">Время работы</div>
              <div className="font-semibold text-foreground">24/7</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
