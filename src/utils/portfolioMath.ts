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
  windowStartPrice: number,
  quantity: number,
): { nominal: number; percent: number } => {
  const nominal = (currentPrice - windowStartPrice) * quantity
  const percent = windowStartPrice === 0 ? 0 : (currentPrice - windowStartPrice) / windowStartPrice
  return { nominal, percent }
}