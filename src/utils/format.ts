// I need here:
//formatCurrency
//formatSignedCurrnecy
//formatPercent
//formatNumbeer


export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const formatPercent = (value: number): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(2)}%`
}