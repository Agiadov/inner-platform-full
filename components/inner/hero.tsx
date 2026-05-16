"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock, Package, MapPin } from "lucide-react";

const stats = [
  { value: "500+", label: "успешных заказов" },
  { value: "7–14", label: "дней доставка" },
];

const recentFinds = [
  {
    id: 1,
    name: "Stone Island Jacket",
    innerPrice: "46 000",
    retailPrice: "89 000",
    savings: 48,
    delivery: "5–7 дней",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Nike x Drake NOCTA",
    innerPrice: "18 500",
    retailPrice: "32 000",
    savings: 42,
    delivery: "7–10 дней",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Prada Re-Nylon Bag",
    innerPrice: "95 000",
    retailPrice: "165 000",
    savings: 42,
    delivery: "5–7 дней",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "New Balance 1906R",
    innerPrice: "14 900",
    retailPrice: "22 990",
    savings: 35,
    delivery: "5–7 дней",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop",
  },
];

export function Hero() {
  return (
    <section className="bg-background pt-20">
      {/* Main Hero */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6">
            Найдём вещь по фото и доставим из-за рубежа
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            INNER — сервис персонального шопинга. Рассчитаем стоимость заранее, найдём лучшую цену и доставим с полным сопровождением.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/request"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl text-base font-medium transition-colors shadow-sm"
            >
              Отправить заявку
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-8 py-4 rounded-2xl text-base font-medium hover:border-hover-border hover:bg-card-soft transition-colors"
            >
              Как это работает
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-semibold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Каждая заявка под контролем */}
      <div className="bg-secondary">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                Каждая заявка под контролем
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                Отправили фото — видите статус. Нашли варианты — выбираете подходящий. Заказали — отслеживаете доставку.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Открыть кабинет
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/request"
                  className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-xl text-sm font-medium hover:bg-card-soft transition-colors"
                >
                  Создать заявку
                </Link>
              </div>
            </div>
            
            {/* Request Preview Card */}
            <div className="bg-card rounded-3xl border border-border shadow-xl shadow-black/5 overflow-hidden">
              {/* Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center justify-between bg-card-soft">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">#1248</span>
                  <span className="px-2.5 py-1 bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Найдены варианты
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="flex gap-4 mb-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-background overflow-hidden flex-shrink-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop" 
                      alt="Stone Island Jacket" 
                      width={96} 
                      height={96} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">Stone Island Jacket</h3>
                    <p className="text-sm text-muted-foreground mb-2">Размер: L · Бюджет: до 50 000 ₽</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      Москва
                    </div>
                  </div>
                </div>
                
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-background rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold text-foreground">3</div>
                    <div className="text-xs text-muted-foreground">предложения</div>
                  </div>
                  <div className="bg-[#16A34A]/10 rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold text-[#16A34A]">-48%</div>
                    <div className="text-xs text-muted-foreground">экономия</div>
                  </div>
                  <div className="bg-background rounded-xl p-3 text-center">
                    <div className="text-lg font-semibold text-foreground">5–7</div>
                    <div className="text-xs text-muted-foreground">дней</div>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#16A34A]"></div>
                    <span className="text-muted-foreground">Получена</span>
                  </div>
                  <div className="flex-1 min-w-3 h-px bg-[#16A34A]"></div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#16A34A]"></div>
                    <span className="text-muted-foreground">В поиске</span>
                  </div>
                  <div className="flex-1 min-w-3 h-px bg-[#16A34A]"></div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-4 ring-[#16A34A]/20"></div>
                    <span className="text-foreground font-medium">Найдены</span>
                  </div>
                  <div className="flex-1 min-w-3 h-px bg-border"></div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-border"></div>
                    <span className="text-muted-foreground">Доставка</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Прозрачная цена */}
      <div className="bg-card border-t border-border">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
              Прозрачная цена
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Вы знаете финальную стоимость до оплаты. Никаких сюрпризов.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-background rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-card rounded-2xl px-5 py-4">
                  <div className="text-sm text-muted-foreground mb-1">Цена товара</div>
                  <div className="text-lg font-semibold text-foreground">35 000 ₽</div>
                </div>
                <div className="bg-card rounded-2xl px-5 py-4">
                  <div className="text-sm text-muted-foreground mb-1">Доставка</div>
                  <div className="text-lg font-semibold text-foreground">3 500 ₽</div>
                </div>
                <div className="bg-card rounded-2xl px-5 py-4">
                  <div className="text-sm text-muted-foreground mb-1">Комиссия</div>
                  <div className="text-lg font-semibold text-foreground">5 000 ₽</div>
                </div>
                <div className="bg-card rounded-2xl px-5 py-4">
                  <div className="text-sm text-muted-foreground mb-1">Пошлины</div>
                  <div className="text-lg font-semibold text-foreground">2 500 ₽</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border-soft">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Финальная стоимость</span>
                  <span className="text-2xl font-semibold text-foreground">46 000 ₽</span>
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Пошлины включаются в расчёт при стоимости товара свыше лимита беспошлинного ввоза
            </p>
          </div>
        </div>
      </div>

      {/* Гарантии */}
      <div className="bg-secondary">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border-soft">
              <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-[#16A34A]" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Проверяем подлинность</h3>
              <p className="text-sm text-muted-foreground">Перед выкупом проверяем товар на оригинальность у поставщика</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border-soft">
              <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 flex items-center justify-center mb-4">
                <Package className="w-5 h-5 text-[#16A34A]" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Экономия до 48%</h3>
              <p className="text-sm text-muted-foreground">На отдельных позициях экономия достигает половины розничной цены</p>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border-soft">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Отслеживание доставки</h3>
              <p className="text-sm text-muted-foreground">Видите статус заказа на каждом этапе до получения</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Finds */}
      <div className="bg-card border-t border-border">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Недавние находки</h2>
            <Link href="/request" className="text-sm text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors">
              Создать заявку
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentFinds.map((product) => (
              <div
                key={product.id}
                className="group bg-card-soft border border-border-soft rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:border-border transition-all cursor-pointer"
              >
                <div className="relative aspect-square bg-background overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#16A34A] text-primary-foreground text-xs font-semibold rounded-lg">
                    -{product.savings}%
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-semibold text-foreground">{product.innerPrice} ₽</span>
                    <span className="text-sm text-muted-foreground line-through">{product.retailPrice} ₽</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {product.delivery}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
