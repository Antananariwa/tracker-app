import { describe, it, expect } from 'vitest'
import { extractLatestStockPrice, extractChartPriceByDateWeekly, adjustDataByTime, mergeGraphStocksData, extractStockInfo, type StockHistoryResponse, type MergedPortfolioAssets, type ChartPriceByDateWeekly} from './stockData'

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

describe('extractChartPriceByDateWeekly', () => {
  it('sorts oldest first and parses numbers', () => {
    const points = extractChartPriceByDateWeekly(sample)
    expect(points.map(p => p.date)).toEqual(['2024-01-02', '2024-01-03', '2024-01-04'])
    expect(points[0]).toEqual({ date: '2024-01-02', close: 10, volume: 200 })
  })
})

describe('adjustDataByTime', () => {
  const points: ChartPriceByDateWeekly[] = []
  for (let i = 0; i < 300; i++) {
    const day = new Date(Date.UTC(2023, 0, 1) + i * 24 * 60 * 60 * 1000)
    points.push({ date: day.toISOString().slice(0, 10), close: i, volume: 0 })
  }

  it('takes the last 21 points for 1M', () => {
    const result = adjustDataByTime(points, '1M')
    expect(result.length).toBe(21)
    expect(result[result.length - 1].close).toBe(299)
  })

  it('filters by date for YTD', () => {
    const result = adjustDataByTime(points, 'YTD')
    expect(result[0].date).toBe('2023-01-01')
    expect(result.length).toBe(300)
  })
})

describe('mergeGraphStocksData', () => {
  const assets = [
    { symbol: 'AAA', quantity: 2, acquiredAt: '2024-01-01' },
    { symbol: 'BBB', quantity: 1, acquiredAt: '2024-01-03' },
  ] as MergedPortfolioAssets[]

  const series = {
    AAA: [
      { date: '2024-01-02', close: 10, volume: 0 },
      { date: '2024-01-03', close: 11, volume: 0 },
    ],
    BBB: [
      { date: '2024-01-02', close: 100, volume: 0 },
      { date: '2024-01-03', close: 101, volume: 0 },
    ],
  }

  it('weights by quantity and skips dates before acquisition', () => {
    expect(mergeGraphStocksData(series, assets)).toEqual([
      { date: '2024-01-02', close: 20, volume: 0 },
      { date: '2024-01-03', close: 22 + 101, volume: 0 },
    ])
  })
})

describe('extractStockInfo', () => {
  it('turns market cap from millions into dollars and fills missing figures with null', () => {
    const info = extractStockInfo({
      profile: { name: 'Apple Inc', ticker: 'AAPL', marketCapitalization: 3000000 },
      metric: { beta: 1.2, '52WeekPriceReturnDaily': 41.3 },
    })
    expect(info?.marketCap).toBe(3000000000000)
    expect(info?.beta).toBe(1.2)
    expect(info?.priceReturn1Y).toBe(41.3)
    expect(info?.peRatio).toBeNull()
  })

  it('returns null when the profile is empty', () => {
    expect(extractStockInfo({ profile: {}, metric: {} })).toBeNull()
  })
})