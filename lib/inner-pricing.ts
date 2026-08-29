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

const DEFAULT_CNY_TO_RUB = 14
const DEFAULT_DELIVERY_RUB = 1500
const DEFAULT_MARGIN_PERCENT = 15

function readPositiveNumber(name: string) {
  const raw = process.env[name]?.trim()
  if (!raw) return undefined
  const value = Number(raw.replace(',', '.'))
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

export function getInnerPricingSettings(): PricingSettings {
  return {
    cnyToRub: readPositiveNumber('INNER_CNY_TO_RUB') ?? DEFAULT_CNY_TO_RUB,
    deliveryRub: readPositiveNumber('INNER_DELIVERY_RUB') ?? DEFAULT_DELIVERY_RUB,
    marginPercent: readPositiveNumber('INNER_MARGIN_PERCENT') ?? DEFAULT_MARGIN_PERCENT,
  }
}

function roundRetailPrice(value: number) {
  return Math.ceil(value / 10) * 10
}

export function calculateInnerPrice(sourcePriceCny: number): InnerPriceBreakdown | undefined {
  if (!Number.isFinite(sourcePriceCny) || sourcePriceCny < 0) return undefined

  const settings = getInnerPricingSettings()
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
