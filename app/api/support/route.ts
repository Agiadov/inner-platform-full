import OpenAI from "openai"
import { NextResponse } from "next/server"

const systemPrompt = `Ты — AI-помощник сервиса INNER, который помогает клиентам покупать одежду и аксессуары из-за рубежа.

ВАЖНЫЕ ПРАВИЛА:
1. НЕ обещай наличие товара — ты не знаешь, есть ли он в наличии
2. НЕ гарантируй точные сроки доставки — называй только примерные диапазоны
3. НЕ называй точные цены — только примерные, финальную цену подтверждает менеджер
4. НЕ принимай оплату и не давай реквизиты
5. НЕ гарантируй 100% подлинность — говори "проверяем перед выкупом"
6. ВСЕГДА предлагай передать вопрос менеджеру для уточнения деталей
7. Отвечай на русском языке
8. Будь вежливым и полезным, но осторожным в обещаниях

О сервисе INNER:
- Находим товары из Европы, США, Азии
- Проверяем продавцов перед выкупом
- Рассчитываем полную стоимость заранее (товар + доставка + комиссия + возможные пошлины)
- Примерные сроки: Европа 5-10 дней, США 7-14 дней, Азия 10-20 дней
- Комиссия сервиса: обычно 10-15% от стоимости товара
- Контакт менеджера: @inner_support в Telegram

Если вопрос сложный или требует проверки конкретной информации — предложи связаться с менеджером.`

type RequestContext = {
  id?: string
  name?: string
  size?: string
  budget?: string
  city?: string
  status?: string
  statusLabel?: string
  selectedOption?: {
    source: string
    country: string
    price: string
    delivery: string
  }
  foundOptions?: Array<{
    source: string
    country: string
    price: string
    delivery: string
    recommended?: boolean
  }>
  adminComment?: string
  statusHistory?: Array<{
    status: string
    date: string
    description?: string
  }>
}

export async function POST(req: Request) {
  try {
    const { messages, requestContext } = await req.json() as {
      messages: Array<{ role: "user" | "assistant"; content: string }>
      requestContext?: RequestContext
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build context message if request data provided
    let contextMessage = ""
    if (requestContext) {
      contextMessage = `\n\nКонтекст заявки клиента:\n`
      if (requestContext.id) contextMessage += `- Номер заявки: #${requestContext.id}\n`
      if (requestContext.name) contextMessage += `- Товар: ${requestContext.name}\n`
      if (requestContext.size) contextMessage += `- Размер: ${requestContext.size}\n`
      if (requestContext.budget) contextMessage += `- Бюджет: ${requestContext.budget}\n`
      if (requestContext.city) contextMessage += `- Город доставки: ${requestContext.city}\n`
      if (requestContext.statusLabel) contextMessage += `- Текущий статус: ${requestContext.statusLabel}\n`
      
      if (requestContext.selectedOption) {
        contextMessage += `- Выбранный вариант: ${requestContext.selectedOption.source} (${requestContext.selectedOption.country}), ${requestContext.selectedOption.price} ₽, доставка ${requestContext.selectedOption.delivery}\n`
      }
      
      if (requestContext.foundOptions && requestContext.foundOptions.length > 0) {
        contextMessage += `- Найдено вариантов: ${requestContext.foundOptions.length}\n`
        requestContext.foundOptions.forEach((opt, i) => {
          contextMessage += `  ${i + 1}. ${opt.source} (${opt.country}): ${opt.price} ₽, доставка ${opt.delivery}${opt.recommended ? " [рекомендуем]" : ""}\n`
        })
      }
      
      if (requestContext.adminComment) {
        contextMessage += `- Комментарий менеджера: ${requestContext.adminComment}\n`
      }
      
      if (requestContext.statusHistory && requestContext.statusHistory.length > 0) {
        contextMessage += `- История статусов:\n`
        requestContext.statusHistory.slice(0, 5).forEach(h => {
          contextMessage += `  • ${h.status} (${h.date})${h.description ? `: ${h.description}` : ""}\n`
        })
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt + contextMessage },
        ...messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || "Извините, не удалось получить ответ."

    return NextResponse.json({ response })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    )
  }
}
