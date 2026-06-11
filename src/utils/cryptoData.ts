export type CoinGeckoResponse = {
  "prices":        [date: number, price: number][],
  "market_caps":   [date: number, value: number][],
  "total_volumes": [date: number, value: number][],
}

export type LatestCryptoPrice = {
  date: number
  price: number
}

export type GraphTimeFrame = "1M" | "3M" | "6M" | "1Y" | "3Y" | "5Y" | "10Y" | "20Y" 



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