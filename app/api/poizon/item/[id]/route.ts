import { NextResponse } from 'next/server'
import { getPoizonItem, OtapiError } from '@/lib/otapi'

export const dynamic = 'force-dynamic'

function errorResponse(error: unknown) {
  if (error instanceof OtapiError) {
    const headers = error.retryAfter ? { 'Retry-After': error.retryAfter } : undefined
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        code: error.code ?? 'OTAPI_ERROR',
      },
      { status: error.status, headers },
    )
  }

  console.error('Poizon item endpoint error:', error)
  return NextResponse.json(
    { ok: false, error: 'Не удалось получить товар Poizon.', code: 'INTERNAL_ERROR' },
    { status: 500 },
  )
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const includeRaw = new URL(request.url).searchParams.get('raw') === '1'
    const result = await getPoizonItem(id)

    return NextResponse.json({
      ok: true,
      provider: 'Poizon',
      productId: result.id,
      product: result.product,
      ...(includeRaw ? { raw: result.raw } : {}),
    })
  } catch (error) {
    return errorResponse(error)
  }
}
