type PricingSettings = {
  cnyToRub: number
  deliveryRub: number
  marginPercent: number
}

export type InnerPriceBreakdown = {
  sourcePriceCny: number
  cnyToRub: number
  productRub: number
  deliveryRub: number
  marginPercent: number
  marginRub: number
  finalPriceRub: number
}

function readPositiveNumber(name: string) {
  const raw = process.env[name]?.trim()
  if (!raw) return undefined
  const value = Number(raw.replace(',', '.'))
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

export function getInnerPricingSettings(): PricingSettings | undefined {
  const cnyToRub = readPositiveNumber('INNER_CNY_TO_RUB')
  const deliveryRub = readPositiveNumber('INNER_DELIVERY_RUB')
  const marginPercent = readPositiveNumber('INNER_MARGIN_PERCENT')

  if (cnyToRub === undefined || deliveryRub === undefined || marginPercent === undefined) {
    return undefined
  }

  return { cnyToRub, deliveryRub, marginPercent }
}

function roundRetailPrice(value: number) {
  return Math.ceil(value / 10) * 10
}

export function calculateInnerPrice(sourcePriceCny: number): InnerPriceBreakdown | undefined {
  const settings = getInnerPricingSettings()
  if (!settings || !Number.isFinite(sourcePriceCny) || sourcePriceCny < 0) return undefined

  const productRub = sourcePriceCny * settings.cnyToRub
  const baseRub = productRub + settings.deliveryRub
  const marginRub = baseRub * (settings.marginPercent / 100)
  const finalPriceRub = roundRetailPrice(baseRub + marginRub)

  return {
    sourcePriceCny,
    cnyToRub: settings.cnyToRub,
    productRub: Math.round(productRub),
    deliveryRub: settings.deliveryRub,
    marginPercent: settings.marginPercent,
    marginRub: Math.round(marginRub),
    finalPriceRub,
  }
}
