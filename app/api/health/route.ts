import { jsonWithCors, preflight } from '@/lib/cors'

export const dynamic = 'force-dynamic'

export function OPTIONS(request: Request) {
  return preflight(request)
}

export function GET(request: Request) {
  return jsonWithCors(request, {
    ok: true,
    service: 'INNER Poizon API',
    otapiConfigured: Boolean(process.env.OTAPI_INSTANCE_KEY),
  })
}
