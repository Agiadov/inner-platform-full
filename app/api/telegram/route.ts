import { NextResponse } from "next/server"

function normalizeTelegramToken(rawToken: string) {
  return rawToken
    .trim()
    .replace(/^https?:\/\/api\.telegram\.org\/bot/i, "")
    .replace(/^bot/i, "")
    .replace(/\/.*$/, "")
}

function safeJson(data: unknown) {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

export async function GET() {
  const rawToken = process.env.TELEGRAM_BOT_TOKEN
  const rawChatId = process.env.TELEGRAM_CHAT_ID

  return NextResponse.json({
    ok: true,
    route: "app/api/telegram/route.ts",
    env: {
      hasTelegramBotToken: Boolean(rawToken),
      telegramBotTokenLooksValid: rawToken ? normalizeTelegramToken(rawToken).includes(":") : false,
      hasTelegramChatId: Boolean(rawChatId),
      telegramChatId: rawChatId ? rawChatId.trim() : null,
    },
    message:
      "GET работает только для диагностики. Для отправки заявки форма должна делать POST на /api/telegram.",
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const rawToken = process.env.TELEGRAM_BOT_TOKEN
    const rawChatId = process.env.TELEGRAM_CHAT_ID

    if (!rawToken || !rawChatId) {
      return NextResponse.json(
        {
          error: "Не настроены переменные TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID",
          details: {
            hasTelegramBotToken: Boolean(rawToken),
            hasTelegramChatId: Boolean(rawChatId),
            hint: "Проверь .env.local в корне проекта рядом с package.json и перезапусти npm run dev",
          },
        },
        { status: 500 }
      )
    }

    const token = normalizeTelegramToken(rawToken)
    const chatId = rawChatId.trim()

    if (!token.includes(":")) {
      return NextResponse.json(
        {
          error: "TELEGRAM_BOT_TOKEN выглядит неправильно",
          details: {
            hint: "В TELEGRAM_BOT_TOKEN должен быть только токен вида 123456:ABC..., без ссылки и без слова bot",
          },
        },
        { status: 500 }
      )
    }

    const contactLabel: Record<string, string> = {
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      phone: "Телефон",
      email: "Email",
    }

    const contact = body.contactMethod
      ? `${contactLabel[body.contactMethod] || body.contactMethod}: ${body.contactValue || "—"}`
      : "не указан"

    const lines = [
      `*INNER — новая заявка ${body.requestNumber || ""}*`,
      ``,
      `*Товар:* ${body.itemName || body.item || body.name || "по фото"}`,
      body.brand ? `*Бренд/модель:* ${body.brand}` : null,
      body.productUrl || body.link ? `*Ссылка:* ${body.productUrl || body.link}` : null,
      ``,
      body.size ? `*Размер:* ${body.size}` : null,
      `*Бюджет:* ${body.budget || "не указан"}`,
      `*Город:* ${body.city || "не указан"}`,
      `*Контакт:* ${contact}`,
      ``,
      body.comment ? `*Комментарий:*\n${body.comment}` : null,
      ``,
      `Фото: ${body.imagesCount ? `${body.imagesCount} шт.` : "нет"}`,
      `Дата: ${body.createdAt || new Date().toLocaleString("ru-RU")}`,
    ]

    const message = lines.filter(Boolean).join("\n").trim()

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      }
    )

    const responseText = await telegramRes.text()
    let telegramData: unknown = responseText

    try {
      telegramData = JSON.parse(responseText)
    } catch {
      telegramData = { raw: responseText }
    }

    if (!telegramRes.ok) {
      console.error("[INNER Telegram] Telegram API error:", telegramData)

      return NextResponse.json(
        {
          error: "Не удалось отправить сообщение в Telegram",
          details: telegramData,
          status: telegramRes.status,
          hint:
            "Если вручную sendMessage работает, проверь .env.local и перезапуск npm run dev. Если не работает — проверь token/chat_id и /start у бота.",
        },
        { status: 500 }
      )
    }

    console.log("[INNER Telegram] Message sent:", safeJson(telegramData))

    return NextResponse.json({ success: true, telegram: telegramData })
  } catch (error) {
    console.error("[INNER Telegram] Route error:", error)

    return NextResponse.json(
      {
        error: "Ошибка сервера при отправке Telegram",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
