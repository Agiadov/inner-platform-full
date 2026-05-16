import { NextResponse } from "next/server"

// Курсы валют к рублю (приблизительные актуальные курсы)
// Обновляются вручную, но можно подключить реальный API
const RATES_TO_RUB: Record<string, number> = {
  EUR: 98.5,
  USD: 89.5,
  GBP: 113.5,
  JPY: 0.59,
  CNY: 12.3,
}

export async function GET() {
  try {
    // Пытаемся получить реальные курсы через ExchangeRate-API (бесплатный)
    const response = await fetch(
      "https://open.er-api.com/v6/latest/RUB",
      { 
        next: { revalidate: 3600 }, // Кешируем на 1 час
        signal: AbortSignal.timeout(5000) // Таймаут 5 секунд
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.result === "success" && data.rates) {
        // Конвертируем: API дает RUB -> другие валюты, нам нужно наоборот
        const rates: Record<string, number> = {}
        
        if (data.rates.EUR) rates.EUR = Math.round((1 / data.rates.EUR) * 100) / 100
        if (data.rates.USD) rates.USD = Math.round((1 / data.rates.USD) * 100) / 100
        if (data.rates.GBP) rates.GBP = Math.round((1 / data.rates.GBP) * 100) / 100
        if (data.rates.JPY) rates.JPY = Math.round((1 / data.rates.JPY) * 100) / 100
        if (data.rates.CNY) rates.CNY = Math.round((1 / data.rates.CNY) * 100) / 100
        
        return NextResponse.json({
          rates,
          source: "live",
          timestamp: new Date().toISOString()
        })
      }
    }
    
    // Если API недоступен, возвращаем статические курсы
    return NextResponse.json({
      rates: RATES_TO_RUB,
      source: "static",
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Error fetching rates:", error)
    
    // Возвращаем статические курсы при ошибке
    return NextResponse.json({
      rates: RATES_TO_RUB,
      source: "static",
      timestamp: new Date().toISOString()
    })
  }
}
