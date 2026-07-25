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