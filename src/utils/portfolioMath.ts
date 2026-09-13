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