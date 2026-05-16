"use client"

import { PageLayout } from "@/components/inner/page-layout"
import Link from "next/link"
import { Search, Shield, Truck, Calculator, Clock, CheckCircle, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Поиск товара",
    description: "Находим любой товар по фото, ссылке или описанию. Ищем в официальных магазинах и у проверенных продавцов по всему миру.",
    features: ["Поиск по фото", "Поиск по ссылке", "Поиск по описанию", "Сравнение цен"],
    price: "Бесплатно"
  },
  {
    icon: Shield,
    title: "Проверка подлинности",
    description: "Проверяем подлинность перед выкупом. Работаем с проверенными продавцами и официальными дистрибьюторами.",
    features: ["Проверка продавца", "Верификация товара", "Фотоотчёт", "Гарантия возврата"],
    price: "Включено"
  },
  {
    icon: Truck,
    title: "Доставка",
    description: "Доставляем в любой город России. Надежная упаковка и отслеживание на каждом этапе. Условия доставки и возможные риски согласуем до выкупа.",
    features: ["Доставка по России", "Отслеживание", "Надежная упаковка", "Прозрачные условия"],
    price: "от 990 ₽"
  },
  {
    icon: Calculator,
    title: "Расчет стоимости",
    description: "Прозрачное ценообразование без скрытых комиссий. Вы знаете итоговую стоимость до оформления заказа.",
    features: ["Фиксированная комиссия", "Без скрытых платежей", "Калькулятор онлайн", "Экономия до 48%"],
    price: "10% комиссия"
  }
]

const process = [
  { step: "01", title: "Отправляете заявку", description: "Фото, ссылка или описание товара" },
  { step: "02", title: "Мы ищем", description: "Находим лучшие варианты за 24-48 часов" },
  { step: "03", title: "Выбираете", description: "Сравниваете цены и выбираете подходящий" },
  { step: "04", title: "Оплачиваете", description: "Безопасная оплата после подтверждения" },
  { step: "05", title: "Получаете", description: "Доставка 7-14 дней с отслеживанием" },
]

export default function ServicesPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight mb-6">
              Услуги
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Полный цикл персонального шопинга: от поиска до доставки. 
              Находим, проверяем и доставляем оригинальные вещи из любой точки мира.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service) => (
              <div 
                key={service.title}
                className="bg-background rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">{service.title}</h3>
                    <span className="text-sm font-medium text-[#16A34A]">{service.price}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Как это работает
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Простой процесс из 5 шагов от заявки до получения товара
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {process.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-semibold">{item.step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center gap-2 bg-card/10 text-primary-foreground/80 px-4 py-2 rounded-full text-sm mb-6">
              <Clock className="w-4 h-4" />
              Ответ в течение 2 часов
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary-foreground mb-4">
              Готовы начать?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Отправьте заявку прямо сейчас и получите подборку вариантов в течение 24-48 часов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request"
                className="inline-flex items-center justify-center gap-2 bg-card text-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors"
              >
                Отправить заявку
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-card/10 transition-colors"
              >
                Рассчитать стоимость
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
