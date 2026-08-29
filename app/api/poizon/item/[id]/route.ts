import { getPoizonItem, OtapiError } from '@/lib/otapi'
import { jsonWithCors, preflight } from '@/lib/cors'
import { normalizePoizonConfiguredVariants, normalizePoizonItemMeta } from '@/lib/poizon-variants'

export const dynamic = 'force-dynamic'

function throwIfRawOtapiError(raw: unknown) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return

  const record = raw as Record<string, unknown>
  const code = typeof record.ErrorCode === 'string' ? record.ErrorCode : undefined
  const description = typeof record.ErrorDescription === 'string' ? record.ErrorDescription : undefined

  if (!code || /^ok$/i.test(code)) return

  const notFound = /not.?found/i.test(code) || /not.?found/i.test(description ?? '')
  const rateLimited = /limit|quota|too many/i.test(`${code} ${description ?? ''}`)

  throw new OtapiError(description ?? `OTCommerce API error: ${code}`, {
    status: notFound ? 404 : rateLimited ? 429 : 502,
    code,
    details: raw,
  })
}

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
    throwIfRawOtapiError(result.raw)

    const variants = normalizePoizonConfiguredVariants(result.raw)
    const meta = normalizePoizonItemMeta(result.raw)

    return jsonWithCors(request, {
      ok: true,
      provider: 'Poizon',
      productId: result.id,
      product: {
        ...result.product,
        ...meta,
        variants,
        sizes: variants.map((variant) => variant.size),
      },
      ...(includeRaw ? { raw: result.raw } : {}),
    })
  } catch (error) {
    return errorResponse(request, error)
  }
}
