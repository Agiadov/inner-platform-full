"use client"

import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import { Shield, Clock, Globe, Users, CheckCircle, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-6">
            О сервисе INNER
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Персональный шопинг-сервис для тех, кто ценит оригинальность, 
            качество и удобство. Мы находим и доставляем вещи из любой 
            точки мира.
          </p>
        </section>

        {/* Stats */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: "Выполненных заказов" },
              { value: "24ч", label: "Время ответа" },
              { value: "7-14", label: "Дней доставка" },
              { value: "48%", label: "Средняя экономия" },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="bg-card rounded-2xl p-6 text-center border border-border"
              >
                <div className="text-3xl sm:text-4xl font-semibold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-12">
            Наши принципы
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Проверка подлинности",
                description: "Работаем с проверенными продавцами. Проверяем подлинность товара перед выкупом и показываем источник."
              },
              {
                icon: Clock,
                title: "Быстрая доставка",
                description: "Среднее время от заявки до получения — 7-14 дней. Отслеживание на каждом этапе через личный кабинет."
              },
              {
                icon: Globe,
                title: "Глобальный поиск",
                description: "Находим товары из США, Европы, Азии и других регионов. Доступ к эксклюзивным коллекциям и лимитированным релизам."
              },
            ].map((value) => (
              <div 
                key={value.title} 
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How we work */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-12">
            Как мы работаем
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Персональный подход",
                description: "Каждую заявку обрабатывает персональный менеджер. Учитываем все пожелания по размеру, цвету и бюджету."
              },
              {
                icon: CheckCircle,
                title: "Прозрачное ценообразование",
                description: "Вы видите стоимость товара, доставки и комиссии до оплаты. Никаких скрытых платежей."
              },
              {
                icon: Shield,
                title: "Гарантия качества",
                description: "Если товар не соответствует описанию или оказался подделкой — вернём деньги в полном объёме."
              },
              {
                icon: Heart,
                title: "Забота о клиенте",
                description: "Поддержка на всех этапах: от консультации до получения. Отвечаем в течение 30 минут."
              },
            ].map((item) => (
              <div 
                key={item.title} 
                className="bg-card rounded-2xl p-6 border border-border flex gap-4"
              >
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary-foreground mb-4">
              Готовы попробовать?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Отправьте первую заявку и убедитесь в качестве нашего сервиса
            </p>
            <a
              href="/request"
              className="inline-flex items-center justify-center bg-card text-foreground px-8 py-3 rounded-full font-medium hover:bg-card/90 transition-colors"
            >
              Отправить заявку
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
