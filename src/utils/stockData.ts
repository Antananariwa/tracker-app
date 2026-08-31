import type { CryptoQuote, CoinChartData } from "./cryptoData"

export type AlphaVantageWeeklyResponse = {
  'Meta Data': {
    '1. Information': string
    '2. Symbol': string
    '3. Last Refreshed': string
    '4. Time Zone': string
  }
  'Weekly Adjusted Time Series': {
    [date: string]: {
      '1. open': string
      '2. high': string
      '3. low': string
      '4. close': string
      '6. volume': string
    }
  }
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
  information: string
  symbol: string
  lastRefreshed: string
  timeZone: string
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






export const extractStockOverview = (data: AlphaVantageWeeklyResponse): StockOverview | null => {
  if (!data || !data['Meta Data']) return null;
  
  return {
    information: data['Meta Data']['1. Information'],
    symbol: data['Meta Data']['2. Symbol'],
    lastRefreshed: data['Meta Data']['3. Last Refreshed'],
    timeZone: data['Meta Data']['4. Time Zone'],
  };
};

export const extractLatestStockPrice = (data: AlphaVantageWeeklyResponse): LatestStockPrice | null => {
  if (!data || !data['Weekly Adjusted Time Series']) return null;
  
  const timeSeries = data['Weekly Adjusted Time Series'];
  const dates = Object.keys(timeSeries).sort((a, b) => b.localeCompare(a));
  const lastDate = dates[0];
  if (!lastDate) return null;
  const latest = timeSeries[lastDate];

  return {
    date: lastDate,
    open: parseFloat(latest['1. open']),
    high: parseFloat(latest['2. high']),
    low: parseFloat(latest['3. low']),
    close: parseFloat(latest['4. close'])
  };
};

export const extractChartPriceByDateWeekly = (data: AlphaVantageWeeklyResponse): ChartPriceByDateWeekly[] => {
  if (!data || !data['Weekly Adjusted Time Series']) return [];

  const timeSeries = data['Weekly Adjusted Time Series'];
  const timeSeriesArrayReversed = Object.entries(timeSeries).sort((a, b) => a[0].localeCompare(b[0]));
  
  const preparedData = timeSeriesArrayReversed.map(([date, values]) => ({
    date: date, 
    close: parseFloat(values['4. close']),
    volume: parseInt(values['6. volume'], 10)
  }))

  return preparedData;
};


export const adjustDataByTime = (data: ChartPriceByDateWeekly[], timeFrame: StockGraphTimeFrame): ChartPriceByDateWeekly[] => {
  if (!data || data.length === 0) return [];

  let weeks = 0;

  switch (timeFrame) {
    case "1M":  weeks = 4;    break;
    case "3M":  weeks = 13;   break;
    case "6M":  weeks = 26;   break;
    case "YTD": {
      const lastDate = data[data.length - 1].date
      const jan1 = lastDate.slice(0, 4) + "-01-01"
      const msPerWeek = 1000 * 60 * 60 * 24 * 7 // transform default millisecondds to week
      weeks = Math.ceil((new Date(lastDate).getTime() - new Date(jan1).getTime()) / msPerWeek)
      break
    }
    case "1Y":  weeks = 52;   break;
    case "3Y":  weeks = 156;  break;
    case "5Y":  weeks = 260;  break;
    case "10Y": weeks = 520;  break;
    case "20Y": return data;
    default:    return data;
  }
  return data.slice(-weeks);
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
      const progress = (new Date(date).getTime() - acquiredMs) / (firstMs - acqui
      close = avgBuyPrice + (firstPrice - avgBuyPrice) * progress
    } else {
      close = priceByDay[date] ?? lastPrice
    }

    series.push({ date, close, volume: 0 })
  }

  return series
}