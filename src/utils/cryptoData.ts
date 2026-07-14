export type CoinGeckoResponse = {
  "prices":        [date: number, price: number][],
  "market_caps":   [date: number, value: number][],
  "total_volumes": [date: number, value: number][],
}

export type LatestCryptoPrice = {
  date: number
  price: number
}

export type CoinChartData = {
  date: string
  price: number 
  volume: number
}

export type CryptoGraphTimeFrame = "1M" | "3M" | "6M" | "1Y" 

export type CoinGeckoInfoResponse = {
  name: string
  symbol: string
  image: { large: string }
  description: { en: string }
  categories: string[]
  genesis_date: string | null
  market_cap_rank: number | null
  links: {
    homepage: string[]
    whitepaper: string
    repos_url: { github: string[] }
  }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    ath: { usd: number }
    circulating_supply: number
    max_supply: number | null
    price_change_percentage_24h: number
  }
}

export type CoinInfo = {
  name: string
  symbol: string
  image: string
  description: string
  categories: string[]
  genesisDate: string | null
  marketCapRank: number | null
  currentPrice: number
  marketCap: number
  totalVolume: number
  ath: number
  circulatingSupply: number
  maxSupply: number | null
  priceChange24h: number
  homepage: string | null
  whitepaper: string | null
  github: string | null
}


export const extractLatestCryptoPrice = (data: CoinGeckoResponse): LatestCryptoPrice | null => {
  if (!data || !data['prices']) return null;
  
  const prices = data['prices'];
  const lastElement = prices[prices.length - 1];

  if (!lastElement) return null;

  const lastDate = lastElement[0];
  const latestPrice = lastElement[1];

  return {
    date: lastDate,
    price: latestPrice,
  };
};


export const extractCoinChartData = (data: CoinGeckoResponse): CoinChartData[] => {
  if (!data || !data['prices'] || !data['total_volumes']) return [];

  const prices = data['prices']

  const volumes = data['total_volumes']

  const exitData = prices.map(([datePoint, pricePoint], index) => ({
    date: new Date(datePoint).toISOString().slice(0, 10),
    price: pricePoint,
    volume: volumes[index]?.[1] ?? 0,
  }))

  return exitData;
} 


export const adjustDataByTime = (data: CoinChartData[], timeFrame: CryptoGraphTimeFrame): CoinChartData[] => {
  if (!data || data.length === 0) return [];

  let days = 0;

  switch (timeFrame) {
    case "1M":  days = 30;   break;
    case "3M":  days = 90;   break;
    case "6M":  days = 180;   break;
    //case "YTD": date >= January 1: break;
    case "1Y":  return data;
    default:    return data;
  };

  return data.slice(-days)
}


export const extractCoinInfo = (data: CoinGeckoInfoResponse): CoinInfo | null => {
  if (!data || !data.market_data) return null

  const md = data.market_data

  return {
    name: data.name,
    symbol: data.symbol.toUpperCase(),
    image: data.image?.large ?? '',
    description: (data.description?.en ?? '').replace(/\r?\n/g, ' ').trim(),
    categories: data.categories ?? [],
    genesisDate: data.genesis_date ?? null,
    marketCapRank: data.market_cap_rank ?? null,
    currentPrice: md.current_price?.usd ?? 0,
    marketCap: md.market_cap?.usd ?? 0,
    totalVolume: md.total_volume?.usd ?? 0,
    ath: md.ath?.usd ?? 0,
    circulatingSupply: md.circulating_supply ?? 0,
    maxSupply: md.max_supply ?? null,
    priceChange24h: md.price_change_percentage_24h ?? 0,
    homepage: data.links?.homepage?.[0] || null,
    whitepaper: data.links?.whitepaper || null,
    github: data.links?.repos_url?.github?.[0] ?? null,
  }
}