export const extractStockOverview = (data) => {
  if (!data || !data['Meta Data']) return null;
  
  return {
    information: data['Meta Data']['1. Information'],
    symbol: data['Meta Data']['2. Symbol'],
    lastRefreshed: data['Meta Data']['3. Last Refreshed'],
    timeZone: data['Meta Data']['5. Time Zone'],
  };
};

export const extractLatestStockPrice = (data) => {
  if (!data || !data['Time Series (Daily)']) return null;
  
  const timeSeries = data['Time Series (Daily)'];
  const dates = Object.keys(timeSeries);
  const lastDate = dates[0];

  return {
    date: lastDate,
    open: data['Time Series (Daily)'][lastDate]['1. open'],
    high: data['Time Series (Daily)'][lastDate]['2. high'],
    low: data['Time Series (Daily)'][lastDate]['3. low'],
    close: data['Time Series (Daily)'][lastDate]['4. close']
  };
};