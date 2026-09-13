import type { MergedPortfolioAssets } from './stockData'

export const calcCurrentValue = (quantity: number, currentPrice: number): number => {
  return quantity * currentPrice
}

export const calcGainLoss = (currentValue: number, purchaseCost: number): number => {
  return currentValue - purchaseCost
}

export const calcGainLossPercent = (currentValue: number, purchaseCost: number): number => {
  if (purchaseCost === 0) return 0
  return (currentValue - purchaseCost) / purchaseCost
}

export const calcTimeframeReturn = (
  currentPrice: number,
  selectedStartPrice: number,
  quantity: number,
): { nominal: number; percent: number } => {
  const nominal = (currentPrice - selectedStartPrice) * quantity
  const percent = selectedStartPrice === 0 ? 0 : (currentPrice - selectedStartPrice) / selectedStartPrice
  return { nominal, percent }
}

export const sumAccountValue = (assets: MergedPortfolioAssets[]): number => {
  let total = 0
  for (const asset of assets) {
    if (asset.currentValue != null) total += asset.currentValue
  }
  return Number(total.toFixed(2))
}

export const sumGainLoss = (assets: MergedPortfolioAssets[]): number => {
  let total = 0
  for (const asset of assets) {
    if (asset.gainLoss != null) total += asset.gainLoss
  }
  return Number(total.toFixed(2))
}

export const sumPurchaseCost = (assets: MergedPortfolioAssets[]): number => {
  let total = 0
  for (const asset of assets) {
    if (asset.purchaseCost) total += asset.purchaseCost
  }
  return total
}

export const calcReturnPercent = (gainLoss: number, purchaseCost: number): number => {
  if (!purchaseCost) return 0
  return gainLoss / purchaseCost * 100
}

export const calcWeightedAnnualRate = (assets: MergedPortfolioAssets[], nowMs: number): number => {
  let sumRateTimesCost = 0
  let sumCost = 0

  for (const asset of assets) {
    if (!asset.currentValue || !asset.purchaseCost) continue
    const years = (nowMs - new Date(asset.acquiredAt).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    if (years <= 0) continue
    const rate = ((asset.currentValue / asset.purchaseCost) ** (1 / years)) - 1
    sumRateTimesCost += rate * asset.purchaseCost
    sumCost += asset.purchaseCost
  }

  if (sumCost === 0) return 0
  return sumRateTimesCost / sumCost
}

export const projectRate = (rate: number, years: number): number => {
  return (((1 + rate) ** years) - 1) * 100
}

export const buildPieData = (assets: MergedPortfolioAssets[]) => {
  return assets
    .filter(a => a.currentValue != null)
    .map(a => ({ name: a.symbol, fullName: a.name, value: a.currentValue as number }))
    .sort((a, b) => b.value - a.value)
}

export const buildCategoryData = (assets: MergedPortfolioAssets[]) => {
  const valueByCategory: { [category: string]: number } = {}
  for (const asset of assets) {
    if (asset.currentValue != null) {
      valueByCategory[asset.category] = (valueByCategory[asset.category] || 0) + asset.currentValue
    }
  }
  return Object.entries(valueByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}