import { NextResponse } from 'next/server'

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

    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_ORDER_CHAT_ID

    if (!token || !chatId) {
      return NextResponse.json({ ok: false, error: 'Telegram не настроен в Vercel.' }, { status: 503 })
    }

    const items = payload.items
      .map((item) => `• ${item.name}${item.size ? `, размер ${item.size}` : ''} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`)
      .join('\n')

    const text = [
      '🧊 Новая заявка INNER',
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

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('Telegram API error:', details)
      return NextResponse.json({ ok: false, error: 'Не удалось отправить заявку.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Order route error:', error)
    return NextResponse.json({ ok: false, error: 'Некорректный запрос.' }, { status: 400 })
  }
}
