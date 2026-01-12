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

export const extractChartPriceByDate = (data) => {

  if (!data || !data['Time Series (Daily)']) return [];

  const timeSeries = data['Time Series (Daily)'];
  const timeSeriesArray = Object.entries(timeSeries)
  const timeSeriesArrayReversed = timeSeriesArray.toReversed()
  
  const preparedData = timeSeriesArrayReversed.map(([date, values]) => ({
    date: date, 
    close: parseFloat(values['4. close']),
    volume: parseInt(values['5. volume'])
  }))

  return preparedData;
};


export const extractChartPriceByDateWeekly = (data) => {

  if (!data || !data['Weekly Time Series']) return [];

  const timeSeries = data['Weekly Time Series'];
  const timeSeriesArray = Object.entries(timeSeries)
  const timeSeriesArrayReversed = timeSeriesArray.toReversed()
  
  const preparedData = timeSeriesArrayReversed.map(([date, values]) => ({
    date: date, 
    close: parseFloat(values['4. close']),
    volume: parseInt(values['5. volume'])
  }))

  return preparedData;

};


export const adjustDataByTime = (data, timeFrame) => {
  switch (timeFrame) {
    case "1M":
      return data.slice(-30);

    case "3M":
      return data;
      
    case "1Y":
      return data.slice(-365);

    case "3Y":
      return data.slice(-3 * 365);

    case "5Y":
      return data.slice(-5 * 365);

    case "10Y":
      return data.slice(-10 * 365);
    
    case "20Y":
      return data;

    default:
      return data;
  }
};
