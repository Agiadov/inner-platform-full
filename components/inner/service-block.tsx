"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Search, ListChecks, CreditCard, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Send,
    number: "1",
    title: "Заявка",
    description: "Пользователь отправляет фото, ссылку или описание",
  },
  {
    icon: Search,
    number: "2",
    title: "Поиск",
    description: "Мы ищем лучшие варианты по цене и надёжности",
  },
  {
    icon: ListChecks,
    number: "3",
    title: "Предложение",
    description: "Присылаем варианты и финальную цену",
  },
  {
    icon: CreditCard,
    number: "4",
    title: "Оплата",
    description: "Пользователь выбирает удобный способ оплаты",
  },
  {
    icon: Package,
    number: "5",
    title: "Доставка",
    description: "Выкупаем и доставляем до двери",
  },
];

export function ServiceBlock() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-card"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-4 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Как это работает
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Пять простых шагов от заявки до получения
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-border" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center lg:text-center transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Step Number Circle */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary border-4 border-card shadow-sm mb-5">
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                    {step.number}
                  </div>
                  <step.icon className="w-10 h-10 text-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/request"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-2xl transition-colors shadow-sm"
          >
            Отправить заявку
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Обычно отвечаем в течение 15 минут
          </p>
        </div>
      </div>
    </section>
  );
}
