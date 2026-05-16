"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { RefreshCw } from "lucide-react"

interface Currency {
  code: string
  symbol: string
  rate: number
}

const MARKUP = 1.081

const defaultCurrencies: Currency[] = [
  { code: "EUR", symbol: "€", rate: Math.round(98.5 * MARKUP * 100) / 100 },
  { code: "USD", symbol: "$", rate: Math.round(89.5 * MARKUP * 100) / 100 },
  { code: "GBP", symbol: "£", rate: Math.round(113.5 * MARKUP * 100) / 100 },
  { code: "JPY", symbol: "¥", rate: Math.round(0.59 * MARKUP * 100) / 100 },
  { code: "CNY", symbol: "¥", rate: Math.round(12.3 * MARKUP * 100) / 100 },
]

export function Calculator() {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaultCurrencies[0])
  const [price, setPrice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  
  const [results, setResults] = useState({
    priceRub: 0,
    delivery: 0,
    commission: 0,
    total: 0,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const fetchRates = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/rates")
      if (!response.ok) throw new Error("Failed to fetch rates")
      const data = await response.json()
      
      const newCurrencies: Currency[] = [
        { code: "EUR", symbol: "€", rate: Math.round((data.rates.EUR || 98.5) * MARKUP * 100) / 100 },
        { code: "USD", symbol: "$", rate: Math.round((data.rates.USD || 89.5) * MARKUP * 100) / 100 },
        { code: "GBP", symbol: "£", rate: Math.round((data.rates.GBP || 113.5) * MARKUP * 100) / 100 },
        { code: "JPY", symbol: "¥", rate: Math.round((data.rates.JPY || 0.59) * MARKUP * 100) / 100 },
        { code: "CNY", symbol: "¥", rate: Math.round((data.rates.CNY || 12.3) * MARKUP * 100) / 100 },
      ]
      
      setCurrencies(newCurrencies)
      const updatedSelected = newCurrencies.find(c => c.code === selectedCurrency.code)
      if (updatedSelected) setSelectedCurrency(updatedSelected)
    } catch (err) {
      console.error("Error fetching rates:", err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCurrency.code])

  useEffect(() => {
    fetchRates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const priceNum = parseFloat(price) || 0
    const priceRub = Math.round(priceNum * selectedCurrency.rate)
    const delivery = priceRub > 0 ? 2500 : 0
    const subtotal = priceRub + delivery
    const commission = Math.round(subtotal * 0.1)
    const total = subtotal + commission

    setResults({ priceRub, delivery, commission, total })
  }, [price, selectedCurrency])

  const formatPrice = (num: number) => {
    if (num === 0) return "—"
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  return (
    <section ref={containerRef} className="py-12 md:py-16 bg-secondary">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block px-3 py-1 bg-primary/10 text-foreground rounded-full text-xs font-medium mb-4">
            Калькулятор
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Расчёт стоимости
          </h2>
          <p className="text-muted-foreground">
            Рассчитайте примерную стоимость заказа
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Input card */}
          <div className="bg-card rounded-2xl border border-border p-6">
            {/* Currency selector */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">Валюта</label>
              <div className="flex flex-wrap gap-2">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      selectedCurrency.code === currency.code
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {currency.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Price input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-3 block">Цена товара</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                  {selectedCurrency.symbol}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 text-2xl text-foreground placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-foreground transition-all"
                />
              </div>
            </div>

            {/* Rate info */}
            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-muted-foreground">
                1 {selectedCurrency.code} = {selectedCurrency.rate.toFixed(2)} ₽
              </span>
              <button
                onClick={fetchRates}
                disabled={isLoading}
                className="text-foreground hover:text-muted-foreground transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Обновление..." : "Обновить курс"}
              </button>
            </div>
          </div>

          {/* Results card */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="text-sm font-medium text-foreground mb-4">Смета</div>

            <div className="space-y-3 mb-6">
              {[
                { label: "Цена в рублях", value: results.priceRub },
                { label: "Доставка", value: results.delivery },
                { label: "Комиссия 10%", value: results.commission },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-lg font-semibold text-foreground">{formatPrice(item.value)} ₽</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-[#16A34A]/10 rounded-2xl p-4 -mx-2">
              <div className="text-sm text-[#16A34A] mb-1">Итого к оплате</div>
              <div className="text-3xl sm:text-4xl font-bold text-[#16A34A]">
                {formatPrice(results.total)} ₽
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Приблизительный расчёт. Итоговая цена подтверждается перед оплатой.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
