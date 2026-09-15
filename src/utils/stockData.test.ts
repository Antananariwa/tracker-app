import { describe, it, expect } from 'vitest'
import { extractLatestStockPrice, extractChartPriceByDateWeekly, adjustDataByTime, mergeGraphStocksData, type StockHistoryResponse, type MergedPortfolioAssets } from './stockData'

const sample: StockHistoryResponse = {
  status: 'ok',
  values: [
    { datetime: '2024-01-03', open: '10', high: '12', low: '9', close: '11', volume: '100' },
    { datetime: '2024-01-02', open: '9', high: '10', low: '8', close: '10', volume: '200' },
    { datetime: '2024-01-04', open: '11', high: '13', low: '10', close: '12', volume: '300' },
  ],
}

describe('extractLatestStockPrice', () => {
  it('returns the newest bar regardless of input order', () => {
    expect(extractLatestStockPrice(sample)).toEqual({ date: '2024-01-04', open: 11, high: 13, low: 10, close: 12 })
  })

  it('returns null when there are no values', () => {
    expect(extractLatestStockPrice({ status: 'ok', values: [] })).toBeNull()
  })
})