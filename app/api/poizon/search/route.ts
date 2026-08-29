import { OtapiError } from '@/lib/otapi'
import { searchPoizonCatalog } from '@/lib/poizon-catalog-search'
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

  console.error('Poizon search endpoint error:', error)
  return jsonWithCors(
    request,
    { ok: false, error: 'Не удалось выполнить поиск Poizon.', code: 'INTERNAL_ERROR' },
    { status: 500 },
  )
}

export function OPTIONS(request: Request) {
  return preflight(request)
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.trim() ?? ''
    const offset = Math.max(0, Number(url.searchParams.get('offset') ?? 0) || 0)
    const requestedLimit = Number(url.searchParams.get('limit') ?? 20) || 20
    const limit = Math.min(40, Math.max(1, requestedLimit))
    const includeRaw = url.searchParams.get('raw') === '1'

    if (query.length < 2) {
      return jsonWithCors(
        request,
        { ok: false, error: 'Введите минимум 2 символа для поиска.', code: 'QUERY_TOO_SHORT' },
        { status: 400 },
      )
    }

    if (query.length > 120) {
      return jsonWithCors(
        request,
        { ok: false, error: 'Поисковый запрос слишком длинный.', code: 'QUERY_TOO_LONG' },
        { status: 400 },
      )
    }

    const result = await searchPoizonCatalog(query, offset, limit)

    return jsonWithCors(request, {
      ok: true,
      provider: 'Poizon',
      query,
      offset,
      limit,
      search: result.search,
      items: result.items,
      ...(includeRaw ? { raw: result.raw } : {}),
    })
  } catch (error) {
    return errorResponse(request, error)
  }
}
