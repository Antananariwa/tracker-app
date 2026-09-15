import { describe, it, expect } from 'vitest'
import { sumAccountValue, sumGainLoss, calcReturnPercent, calcWeightedAnnualRate, projectRate, buildCategoryData } from './portfolioMath'
import type { MergedPortfolioAssets } from './stockData'

const assets = [
  { symbol: 'AAA', category: 'stock', currentValue: 200, gainLoss: 100, purchaseCost: 100, acquiredAt: '2023-01-01' },
  { symbol: 'BBB', category: 'crypto', currentValue: 50, gainLoss: -10, purchaseCost: 60, acquiredAt: '2023-01-01' },
  { symbol: 'CCC', category: 'stock', currentValue: null, gainLoss: null, purchaseCost: 30, acquiredAt: '2023-01-01' },
] as MergedPortfolioAssets[]

describe('sums', () => {
  it('ignores assets without a current value', () => {
    expect(sumAccountValue(assets)).toBe(250)
    expect(sumGainLoss(assets)).toBe(90)
  })
})

describe('calcReturnPercent', () => {
  it('returns zero when there is no cost', () => {
    expect(calcReturnPercent(50, 0)).toBe(0)
  })

  it('returns percent of cost', () => {
    expect(calcReturnPercent(50, 200)).toBe(25)
  })
})

describe('calcWeightedAnnualRate', () => {
  it('doubling in exactly one year is a rate of 1', () => {
    const oneYearLater = new Date('2023-01-01').getTime() + 365.25 * 24 * 60 * 60 * 1000
    const single = [assets[0]]
    expect(calcWeightedAnnualRate(single, oneYearLater)).toBeCloseTo(1, 6)
  })
})

describe('projectRate', () => {
  it('one year is the rate in percent', () => {
    expect(projectRate(0.1, 1)).toBeCloseTo(10, 6)
  })

  it('compounds over three years', () => {
    expect(projectRate(0.1, 3)).toBeCloseTo(33.1, 6)
  })
})

describe('buildCategoryData', () => {
  it('sums per category and sorts largest first', () => {
    expect(buildCategoryData(assets)).toEqual([
      { name: 'stock', value: 200 },
      { name: 'crypto', value: 50 },
    ])
  })
})