"use client"

import { PageLayout } from "@/components/inner/page-layout"
import { Shield, Calculator, Clock, Package, XCircle, MessageSquare, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const sections = [
  {
    icon: Shield,
    title: "Как мы проверяем продавцов",
    content: [
      "Работаем только с проверенными поставщиками и официальными магазинами",
      "Проверяем репутацию продавца, историю продаж и отзывы",
      "Запрашиваем фотоотчёт товара перед выкупом",
      "При сомнениях в подлинности — отказываемся от сделки",
      "Не работаем с продавцами без истории или с негативными отзывами"
    ]
  },
  {
    icon: Calculator,
    title: "Как формируется цена",
    content: [
      "Цена товара — стоимость у продавца в валюте страны происхождения",
      "Доставка — зависит от веса, габаритов и региона (от 990 ₽)",
      "Комиссия сервиса — 10% от стоимости товара (минимум 500 ₽)",
      "Таможенные пошлины — при превышении лимита беспошлинного ввоза (200 EUR)",
      "Финальная стоимость фиксируется до оплаты — никаких скрытых платежей"
    ]
  },
  {
    icon: Package,
    title: "Что входит в комиссию",
    content: [
      "Поиск товара по фото, ссылке или описанию",
      "Проверка продавца и подлинности товара",
      "Переговоры с продавцом и оформление заказа",
      "Контроль качества и фотоотчёт перед отправкой",
      "Полное сопровождение до получения товара",
      "Консультации и поддержка на всех этапах"
    ]
  },
  {
    icon: Clock,
    title: "Сроки доставки",
    content: [
      "Европа — 5-10 рабочих дней",
      "США — 7-14 рабочих дней",
      "Азия — 10-20 рабочих дней",
      "Сроки зависят от наличия товара, способа доставки и таможенного оформления",
      "Возможны задержки по независящим от нас причинам — заранее предупреждаем",
      "Отслеживание на каждом этапе с уведомлениями"
    ]
  },
  {
    icon: XCircle,
    title: "Отмена заказа",
    content: [
      "До выкупа товара — отмена бесплатно, без комиссий",
      "После выкупа — возврат зависит от политики продавца",
      "Мы заранее уточняем условия возврата у каждого продавца",
      "При отмене по нашей вине — полный возврат средств",
      "При несоответствии товара описанию — помогаем с возвратом"
    ]
  },
  {
    icon: MessageSquare,
    title: "Поддержка",
    content: [
      "Telegram — основной канал связи, ответ в течение 2 часов",
      "WhatsApp — для тех, кому удобнее",
      "Email — для официальных запросов",
      "Личный кабинет — отслеживание статуса и история переписки",
      "Работаем ежедневно с 10:00 до 22:00 (МСК)"
    ]
  }
]

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight mb-6">
              Условия сервиса
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Прозрачные правила работы. Мы заранее согласуем все условия, 
              чтобы вы знали, чего ожидать на каждом этапе.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div 
                key={section.title}
                className="bg-background rounded-3xl p-8 sm:p-10"
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground mb-1 block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-card rounded-3xl p-8 sm:p-10 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Важно понимать
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Мы не являемся магазином и не храним товары. Мы — персональный шопинг-сервис, 
                который помогает найти и купить вещи из-за рубежа.
              </p>
              <p>
                Каждый заказ индивидуален. Условия доставки, возврата и возможные риски 
                обсуждаются до выкупа товара. Мы заранее предупреждаем о всех нюансах.
              </p>
              <p>
                Мы не даём гарантий, которые не можем выполнить. Но делаем всё возможное, 
                чтобы ваш заказ прошёл гладко.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold text-primary-foreground mb-4">
              Остались вопросы?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Напишите нам — ответим на любые вопросы о сервисе и условиях работы
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/inner_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-card text-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors"
              >
                Написать в Telegram
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-card/10 transition-colors"
              >
                Частые вопросы
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
