import type { CryptoQuote, CoinChartData } from "./cryptoData"

export type StockHistoryResponse = {
  meta?: {
    symbol: string
    interval: string
    currency: string
    exchange_timezone: string
    exchange: string
    mic_code: string
    type: string
  }
  values?: {
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }[]
  status: 'ok' | 'error'
}

export type StockQuote = {
  'current_price': number
  'change': number
  'percent_change': number
  'high_price_of_the_day': number
  'low_price_of_the_day': number
  'open_price_of_the_day': number
  'previous_close_price': number
  'time': number
}

export type StockOverview = {
  symbol: string
  exchange: string
  type: string
  currency: string
  timeZone: string
}

export type StockInfoResponse = {
  profile: {
    name?: string
    ticker?: string
    logo?: string
    finnhubIndustry?: string
    country?: string
    ipo?: string
    weburl?: string
    marketCapitalization?: number
  }
  metric: {
    peBasicExclExtraTTM?: number | null
    epsBasicExclExtraItemsTTM?: number | null
    '52WeekHigh'?: number | null
    '52WeekLow'?: number | null
    dividendYieldIndicatedAnnual?: number | null
    beta?: number | null
    '52WeekPriceReturnDaily'?: number | null
    yearToDatePriceReturnDaily?: number | null
    revenueGrowthTTMYoy?: number | null
    epsGrowthTTMYoy?: number | null
    netProfitMarginTTM?: number | null
    'priceRelativeToS&P50052Week'?: number | null
  }
}

export type StockInfo = {
  name: string
  ticker: string
  logo: string | null
  industry: string | null
  country: string | null
  ipo: string | null
  website: string | null
  marketCap: number | null
  peRatio: number | null
  eps: number | null
  weekHigh52: number | null
  weekLow52: number | null
  dividendYield: number | null
  beta: number | null
  priceReturn1Y: number | null
  priceReturnYTD: number | null
  revenueGrowth: number | null
  epsGrowth: number | null
  netMargin: number | null
  vsSp500_1Y: number | null
}

export type LatestStockPrice = {
  date: string
  open: number
  high: number
  low: number
  close: number
}

export type ChartPriceByDateWeekly = {
  date: string
  close: number
  volume: number
}

export type StockGraphTimeFrame = "1M" | "3M" | "6M" | "YTD" | "1Y" | "3Y" | "5Y" | "10Y" | "20Y" 

export type SupabaseAssetsTable = {
  id: string
  user_id: string
  symbol: string
  name: string
  category: 'stock' | 'crypto' | 'real_estate'
  quantity: number
  avg_buy_price: number
  status: 'hold' | 'to_sell' | 'watching'
  created_at: string
  acquired_at: string
  coin_id: string
}

export type AssetReturnData = {
  currentPrice: number | null
  currentValue: number | null
  gainLoss: number | null
  gainLossPercent: number | null
  timeframeReturn: number | null
  timeframeReturnPercent: number | null
  fetchedAt: string | null
}

export type PortfolioAsset = {
  symbol: string
  category: string
  name: string
  quantity: number
  avgBuyPrice: number
  purchaseCost: number
  status: 'hold' | 'to_sell' | 'watching'
  acquiredAt: string
  returnData?: AssetReturnData
  coinId: string
}

export type MergedPortfolioAssets = {
  symbol: string
  category: string
  name: string
  quantity: number
  avgBuyPrice: number
  purchaseCost: number
  status: 'hold' | 'to_sell' | 'watching'
  acquiredAt: string
  currentPrice: number | null
  currentValue: number | null
  gainLoss: number | null
  gainLossRatio: number | null
}






export const extractStockOverview = (data: StockHistoryResponse): StockOverview | null => {
  if (!data || !data.meta) return null;

  return {
    symbol: data.meta.symbol,
    exchange: data.meta.exchange,
    type: data.meta.type,
    currency: data.meta.currency,
    timeZone: data.meta.exchange_timezone,
  };
};

export const extractStockInfo = (data: StockInfoResponse): StockInfo | null => {
  if (!data || !data.profile) return null;

  const profile = data.profile
  const metric = data.metric

  if (!profile.name) return null;

  return {
    name: profile.name,
    ticker: profile.ticker ?? '',
    logo: profile.logo || null,
    industry: profile.finnhubIndustry || null,
    country: profile.country || null,
    ipo: profile.ipo || null,
    website: profile.weburl || null,
    marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : null,
    peRatio: metric.peBasicExclExtraTTM ?? null,
    eps: metric.epsBasicExclExtraItemsTTM ?? null,
    weekHigh52: metric['52WeekHigh'] ?? null,
    weekLow52: metric['52WeekLow'] ?? null,
    dividendYield: metric.dividendYieldIndicatedAnnual ?? null,
    beta: metric.beta ?? null,
    priceReturn1Y: metric['52WeekPriceReturnDaily'] ?? null,
    priceReturnYTD: metric.yearToDatePriceReturnDaily ?? null,
    revenueGrowth: metric.revenueGrowthTTMYoy ?? null,
    epsGrowth: metric.epsGrowthTTMYoy ?? null,
    netMargin: metric.netProfitMarginTTM ?? null,
    vsSp500_1Y: metric['priceRelativeToS&P50052Week'] ?? null,
  };
};

export const extractLatestStockPrice = (data: StockHistoryResponse): LatestStockPrice | null => {
  if (!data || !data.values || data.values.length === 0) return null;

  const sorted = [...data.values].sort((a, b) => b.datetime.localeCompare(a.datetime));
  const latest = sorted[0];

  return {
    date: latest.datetime.slice(0, 10),
    open: parseFloat(latest.open),
    high: parseFloat(latest.high),
    low: parseFloat(latest.low),
    close: parseFloat(latest.close)
  };
};

export const extractChartPriceByDateWeekly = (data: StockHistoryResponse): ChartPriceByDateWeekly[] => {
  if (!data || !data.values) return [];

  const sorted = [...data.values].sort((a, b) => a.datetime.localeCompare(b.datetime));

  const preparedData = sorted.map(bar => ({
    date: bar.datetime.slice(0, 10),
    close: parseFloat(bar.close),
    volume: parseInt(bar.volume, 10)
  }))

  return preparedData;
};


export const adjustDataByTime = (data: ChartPriceByDateWeekly[], timeFrame: StockGraphTimeFrame): ChartPriceByDateWeekly[] => {
  if (!data || data.length === 0) return [];

  let days = 0;

  switch (timeFrame) {
    case "1M":  days = 21;    break;
    case "3M":  days = 63;    break;
    case "6M":  days = 126;   break;
    case "YTD": {
      const lastDate = data[data.length - 1].date
      const jan1 = lastDate.slice(0, 4) + "-01-01"
      return data.filter(point => point.date >= jan1)
    }
    case "1Y":  days = 252;   break;
    case "3Y":  days = 756;   break;
    case "5Y":  days = 1260;  break;
    case "10Y": days = 2520;  break;
    case "20Y": return data;
    default:    return data;
  }
  return data.slice(-days);
};


export const preparePortfolioAssets = (assets: SupabaseAssetsTable[]): PortfolioAsset[] => {
  return assets.map(asset => ({
    symbol: asset.symbol,
    category: asset.category,
    name: asset.name,
    quantity: asset.quantity,
    avgBuyPrice: asset.avg_buy_price,
    purchaseCost: asset.quantity * asset.avg_buy_price,
    status: asset.status,
    acquiredAt: asset.acquired_at,
    coinId: asset.coin_id,
  }))
}





export const mergeFullAssetsWithStockQuotes = (quote: {[symbol: string]: StockQuote | null;}, assets: SupabaseAssetsTable[]): MergedPortfolioAssets[] => {
  const stockAssets = assets.filter(asset => asset.category === 'stock')

  return stockAssets.map(asset => {
    const buyCost = asset.quantity * asset.avg_buy_price
    const symbolPath = quote[asset['symbol']]

    if (symbolPath == null) {
      return {
        symbol: asset.symbol,
        category: asset.category,
        name: asset.name,
        quantity: asset.quantity,
        avgBuyPrice: asset.avg_buy_price,
        purchaseCost: buyCost,
        status: asset.status,
        acquiredAt: asset.acquired_at,
        currentPrice: null,
        currentValue: null,
        gainLoss: null,
        gainLossRatio: null,
      }
    }

    const price = symbolPath.current_price
    const value = price * asset.quantity

    return {
    symbol: asset.symbol,
    category: asset.category,
    name: asset.name,
    quantity: asset.quantity,
    avgBuyPrice: asset.avg_buy_price,
    purchaseCost: buyCost,
    status: asset.status,
    acquiredAt: asset.acquired_at,
    currentPrice: price,
    currentValue: value,
    gainLoss: (value ? value - buyCost : null),
    gainLossRatio: (value ? (value - buyCost)/buyCost : null), 
    }
  })
}



export const mergeFullAssetsWithCryptoQuotes = (quote: { [coin_id: string]: CryptoQuote | null }, assets: SupabaseAssetsTable[]): MergedPortfolioAssets[] => {
  const cryptoAssets = assets.filter(asset => asset.category === 'crypto')

  return cryptoAssets.map(asset => {
    const buyCost = asset.quantity * asset.avg_buy_price
    const coinIdPath = quote[asset['coin_id']]

    if (coinIdPath == null) {
      return {
        symbol: asset.symbol,
        category: asset.category,
        name: asset.name,
        quantity: asset.quantity,
        avgBuyPrice: asset.avg_buy_price,
        purchaseCost: buyCost,
        status: asset.status,
        acquiredAt: asset.acquired_at,
        currentPrice: null,
        currentValue: null,
        gainLoss: null,
        gainLossRatio: null,
      }
    }

    const price = coinIdPath.price
    const value = price * asset.quantity

    return {
      symbol: asset.symbol,
      category: asset.category,
      name: asset.name,
      quantity: asset.quantity,
      avgBuyPrice: asset.avg_buy_price,
      purchaseCost: buyCost,
      status: asset.status,
      acquiredAt: asset.acquired_at,
      currentPrice: price,
      currentValue: value,
      gainLoss: (value ? value - buyCost : null),
      gainLossRatio: (value ? (value - buyCost)/buyCost : null), 
    }
  })
}


export const mergeGraphStocksData = ( allTrimmedData: { [symbol: string]: ChartPriceByDateWeekly[] | null }, allPortfolioAssets: MergedPortfolioAssets[] ) => {
  const quantityBySymbol = allPortfolioAssets.reduce((acc: { [symbol: string]: number }, asset) => {
    acc[asset.symbol] = asset.quantity
    return acc
  }, {})

  const acquiredBySymbol = allPortfolioAssets.reduce((acc: { [symbol: string]: string }, asset) => {
    acc[asset.symbol] = asset.acquiredAt
    return acc
  }, {})

  const summary = Object.entries(allTrimmedData).reduce((acc: { [date: string]: number }, [symbol, series]) => {
    if (!series) return acc
    const quantity = quantityBySymbol[symbol] ?? 0
    const acquired = (acquiredBySymbol[symbol] ?? '').slice(0, 10)
    for (const { date, close } of series) {
      if (date < acquired) continue
      acc[date] = (acc[date] || 0) + close * quantity
    }
    return acc
  }, {})

  return Object.entries(summary)
    .map(([date, close]) => ({ date, close, volume: 0 }))
    .sort((a, b) => a.date.localeCompare(b.date))
}


export const buildCryptoWeeklySeries = (
  dailySeries: CoinChartData[],
  weeklyDates: string[],
  acquiredAt: string,
  avgBuyPrice: number
): ChartPriceByDateWeekly[] => {
  if (!dailySeries || dailySeries.length === 0) return []

  const priceByDay: { [date: string]: number } = {}
  for (const point of dailySeries) {
    priceByDay[point.date] = point.price
  }

  const acquiredDay = acquiredAt.slice(0, 10)
  const firstDay = dailySeries[0].date
  const firstPrice = dailySeries[0].price
  const lastPrice = dailySeries[dailySeries.length - 1].price

  const acquiredMs = new Date(acquiredDay).getTime()
  const firstMs = new Date(firstDay).getTime()

  const series: ChartPriceByDateWeekly[] = []

  for (const date of weeklyDates) {
    if (date < acquiredDay) continue

    let close: number

    if (date < firstDay) {
      const progress = (new Date(date).getTime() - acquiredMs) / (firstMs - acquiredMs)
      close = avgBuyPrice + (firstPrice - avgBuyPrice) * progress
    } else {
      close = priceByDay[date] ?? lastPrice
    }

    series.push({ date, close, volume: 0 })
  }

  return series
}