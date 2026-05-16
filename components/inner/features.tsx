"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Shield, Calculator, Truck } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Поиск по фото или ссылке",
    description: "Отправьте фото, ссылку или описание — мы найдём товар в любом магазине мира по лучшей цене",
  },
  {
    icon: Shield,
    title: "Проверка подлинности",
    description: "Проверяем подлинность товара перед выкупом. Работаем с проверенными продавцами.",
  },
  {
    icon: Calculator,
    title: "Расчёт полной стоимости",
    description: "Заранее рассчитываем финальную цену с доставкой и комиссиями. Никаких сюрпризов.",
  },
  {
    icon: Truck,
    title: "Выкуп и доставка",
    description: "Выкупаем товар, упаковываем и доставляем до двери за 7–14 дней с полным отслеживанием.",
  },
];

export function Features() {
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
      id="services"
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-background"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-4 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Услуги
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Полный цикл от поиска до доставки
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative p-6 sm:p-8 rounded-3xl bg-card border border-border-soft hover:shadow-xl hover:shadow-black/5 hover:border-border transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-5">
                <service.icon className="w-6 h-6 text-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
