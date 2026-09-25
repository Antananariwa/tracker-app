// I need here:
//formatCurrency
//formatSignedCurrnecy
//formatPercent
//formatNumbeer


export const formatCurrency = (value: number, currencyCode: ('USD' | 'EUR' | 'GBP')): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(value)
}

export const formatPercentChange = (value: number): string => {
  const sign = value > 0 ? '+' : ''

  return `${sign}${(value * 100).toFixed(2)}%` // value is stored as a ratio like 0.08, therefore * 100
}

export const formatBigCurrency = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}