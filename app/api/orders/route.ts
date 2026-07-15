import { NextResponse } from 'next/server'
import { isSupabaseConfigured, supabaseRequest } from '@/lib/supabase-rest'

type OrderItem = {
  name: string
  size?: string
  quantity: number
  price: number
}

type OrderPayload = {
  name: string
  telegram: string
  city: string
  comment?: string
  items: OrderItem[]
  total: number
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload

    if (!payload.name || !payload.telegram || !payload.city || !payload.items?.length) {
      return NextResponse.json({ ok: false, error: 'Заполните обязательные поля.' }, { status: 400 })
    }

    let orderId: number | null = null

    if (isSupabaseConfigured()) {
      const created = await supabaseRequest<Array<{ id: number }>>('orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: payload.name,
          telegram: payload.telegram,
          city: payload.city,
          comment: payload.comment || '',
          items: payload.items,
          total: payload.total,
          status: 'new',
        }),
      })
      orderId = created[0]?.id ?? null
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_ORDER_CHAT_ID

    const items = payload.items
      .map((item) => `• ${item.name}${item.size ? `, размер ${item.size}` : ''} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`)
      .join('\n')

    const text = [
      '🧊 Новая заявка INNER',
      orderId ? `Заказ №${orderId}` : '',
      '',
      `Имя: ${payload.name}`,
      `Telegram: ${payload.telegram}`,
      `Город: ${payload.city}`,
      payload.comment ? `Комментарий: ${payload.comment}` : '',
      '',
      items,
      '',
      `Итого без доставки: ${payload.total.toLocaleString('ru-RU')} ₽`,
    ].filter(Boolean).join('\n')

    let telegramSent = false
    if (token && chatId) {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      })

      if (!response.ok) {
        const details = await response.text()
        console.error('Telegram API error:', details)
      } else {
        telegramSent = true
      }
    }

    if (!orderId && !telegramSent) {
      return NextResponse.json({ ok: false, error: 'База и Telegram пока не настроены.' }, { status: 503 })
    }

    return NextResponse.json({ ok: true, orderId, telegramSent })
  } catch (error) {
    console.error('Order route error:', error)
    return NextResponse.json({ ok: false, error: 'Не удалось сохранить заявку.' }, { status: 500 })
  }
}
