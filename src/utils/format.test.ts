import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercentChange, formatBigCurrency } from './format'

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

describe('formatBigCurrency', () => {
  it('shortens trillions, billions and millions', () => {
    expect(formatBigCurrency(3450000000000)).toBe('$3.45T')
    expect(formatBigCurrency(12300000000)).toBe('$12.30B')
    expect(formatBigCurrency(4500000)).toBe('$4.50M')
  })
})