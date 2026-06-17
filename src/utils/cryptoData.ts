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
  timestamp: number
}

export type GraphTimeFrame = "1M" | "3M" | "6M" | "1Y" 


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
    date: new Date(datePoint).toLocaleDateString('en-GB'),
    price: pricePoint,
    volume: volumes[index]?.[1] ?? 0
    timestamp: datePoint
  }))

  return exitData;
} 


export const adjustDataByTime = (data: CoinChartData[], timeFrame: GraphTimeFrame): CoinChartData[] => {
  if (!data || data.length === 0) return [];

  const latestTimeStamp = data[data.length - 1].timestamp
  if (!latestTimeStamp) return [];
  // const reversedData = data.reverse(); - might be usefull if filetering with manual loop
  let days = 0;

  switch (timeFrame) {
    case "1M":  days = 30;   break;
    case "3M":  days = 90;   break;
    case "6M":  days = 180;   break;
    case "1Y":  return data;
    default:    return data;
  };

  const cutoff = latestTimeStamp - days * 86400000;

  return data.filter(point => point.timestamp >= cutoff);
}
