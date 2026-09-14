import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercentChange } from './format'

describe('formatCurrency', () => {
  it('formats dollars with two decimals and separators', () => {
    expect(formatCurrency(1234.5, 'USD')).toBe('$1,234.50')
  })
})

describe('formatPercentChange', () => {
  it('adds a plus sign for gains', () => {
    expect(formatPercentChange(0.0812)).toBe('+8.12%')
  })

  it('keeps the minus sign for losses', () => {
    expect(formatPercentChange(-0.05)).toBe('-5.00%')
  })
})