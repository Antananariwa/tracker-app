export type AlphaVantageWeeklyResponse = {
  'Meta Data': {
    '1. Information': string
    '2. Symbol': string
    '3. Last Refreshed': string
    '4. Time Zone': string
  }
  'Weekly Time Series': {
    [date: string]: {
      '1. open': string
      '2. high': string
      '3. low': string
      '4. close': string
      '5. volume': string
    }
  }
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
}

export type PortfolioAsset = {
  symbol: string
  name: string
  quantity: number
  avgBuyPrice: number
  purchaseCost: number
  status: 'hold' | 'to_sell' | 'watching'
  acquiredAt: string
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
  if (!data || !data['Weekly Time Series']) return null;
  
  const timeSeries = data['Weekly Time Series'];
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
  if (!data || !data['Weekly Time Series']) return [];

  const timeSeries = data['Weekly Time Series'];
  const timeSeriesArrayReversed = Object.entries(timeSeries).sort((a, b) => a[0].localeCompare(b[0]));
  
  const preparedData = timeSeriesArrayReversed.map(([date, values]) => ({
    date: date, 
    close: parseFloat(values['4. close']),
    volume: parseInt(values['5. volume'], 10)
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
    name: asset.name,
    quantity: asset.quantity,
    avgBuyPrice: asset.avg_buy_price,
    purchaseCost: asset.quantity * asset.avg_buy_price,
    status: asset.status,
    acquiredAt: asset.acquired_at,
  }))
}
