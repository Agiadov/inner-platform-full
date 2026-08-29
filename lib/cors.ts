import { NextResponse } from 'next/server'

const ALLOWED_ORIGINS = new Set([
  'https://innerbuy.store',
  'https://www.innerbuy.store',
])

export function corsHeaders(request: Request) {
  const origin = request.headers.get('origin')
  const headers = new Headers()

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  headers.set('Vary', 'Origin')

  return headers
}

export function jsonWithCors(request: Request, body: unknown, init?: ResponseInit) {
  const headers = corsHeaders(request)
  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value))
  }

  return NextResponse.json(body, {
    ...init,
    headers,
  })
}

export function preflight(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}
