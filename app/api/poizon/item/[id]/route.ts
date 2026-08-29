import { getPoizonItem, OtapiError } from '@/lib/otapi'
import { jsonWithCors, preflight } from '@/lib/cors'

export const dynamic = 'force-dynamic'

function errorResponse(request: Request, error: unknown) {
  if (error instanceof OtapiError) {
    const headers = error.retryAfter ? { 'Retry-After': error.retryAfter } : undefined
    return jsonWithCors(
      request,
      {
        ok: false,
        error: error.message,
        code: error.code ?? 'OTAPI_ERROR',
      },
      { status: error.status, headers },
    )
  }

  console.error('Poizon item endpoint error:', error)
  return jsonWithCors(
    request,
    { ok: false, error: 'Не удалось получить товар Poizon.', code: 'INTERNAL_ERROR' },
    { status: 500 },
  )
}

export function OPTIONS(request: Request) {
  return preflight(request)
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const includeRaw = new URL(request.url).searchParams.get('raw') === '1'
    const result = await getPoizonItem(id)

    return jsonWithCors(request, {
      ok: true,
      provider: 'Poizon',
      productId: result.id,
      product: result.product,
      ...(includeRaw ? { raw: result.raw } : {}),
    })
  } catch (error) {
    return errorResponse(request, error)
  }
}
