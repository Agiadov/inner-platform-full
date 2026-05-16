"use client"

import { Header } from "@/components/inner/header"
import { Footer } from "@/components/inner/footer"
import Link from "next/link"
import { useState } from "react"
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react"

const questions = [
  {
    question: "Как начать?",
    answer: "Отправьте фото или ссылку на вещь через форму заявки или в Telegram. Мы найдём её, проверим у поставщика и рассчитаем полную стоимость до оплаты."
  },
  {
    question: "Какие способы оплаты?",
    answer: "Банковские карты (Visa, Mastercard, МИР), банковские переводы. Условия оплаты согласуются перед выкупом товара."
  },
  {
    question: "Как долго занимает поиск?",
    answer: "Обычные вещи — 1-3 дня. Редкие и лимитированные коллекции — до 2 недель. Держим вас в курсе на каждом этапе."
  },
  {
    question: "Работаете с люксом?",
    answer: "Да, работаем с люксовыми брендами: Gucci, Louis Vuitton, Balenciaga, Prada. Проверяем подлинность перед выкупом."
  },
  {
    question: "Если вещь не подошла?",
    answer: "Перед выкупом предоставляем детальные фото, размеры и описание состояния. Условия возврата зависят от конкретного продавца и обсуждаются заранее."
  },
  {
    question: "Как формируется цена?",
    answer: "Финальная стоимость фиксируется до оплаты и включает: цену товара, доставку, комиссию и возможные пошлины. Никаких скрытых платежей."
  },
  {
    question: "Находите винтаж?",
    answer: "Да, у нас есть контакты среди коллекционеров и vintage-магазинов. Находим архивные коллекции — сроки и условия зависят от редкости товара."
  },
  {
    question: "Сроки доставки?",
    answer: "Европа — 5-10 дней, США — 7-14 дней, Азия — 10-20 дней. Мы заранее предупреждаем о сроках, комиссиях и возможных рисках."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-24 pb-8 px-4 sm:px-6 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium mb-4">
            FAQ
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Частые вопросы
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Ответы на популярные вопросы о нашем сервисе
          </p>
        </div>
      </section>

      {/* Questions */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {questions.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-foreground">{item.question}</span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 pl-[60px]">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
            Остались вопросы?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Напишите нам, и мы ответим в течение часа
          </p>
          <Link
            href="https://t.me/innerlabel"
            target="_blank"
            className="inline-flex items-center gap-2 bg-card text-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-background transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Написать в Telegram
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
