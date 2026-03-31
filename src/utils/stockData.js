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
  if (!data || !data['Weekly Time Series']) return null;
  
  const timeSeries = data['Weekly Time Series'];
  const dates = Object.keys(timeSeries);
  const lastDate = dates[0];

  return {
    date: lastDate,
    open: data['Weekly Time Series'][lastDate]['1. open'],
    high: data['Weekly Time Series'][lastDate]['2. high'],
    low: data['Weekly Time Series'][lastDate]['3. low'],
    close: data['Weekly Time Series'][lastDate]['4. close']
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
  if (!data || data.length === 0) return [];

  const currDate = data[data.length - 1]["date"];
  const compare = currDate.split('-');

  let year = Number(compare[0]);
  let month = Number(compare[1]);
  let totalMonths = year * 12 + (month - 1);

  switch (timeFrame) {
    case "1M":  totalMonths -= 1;   break;
    case "3M":  totalMonths -= 3;   break;
    case "6M":  totalMonths -= 6;   break;
    case "1Y":  totalMonths -= 12;  break;
    case "3Y":  totalMonths -= 36;  break;
    case "5Y":  totalMonths -= 60;  break;
    case "10Y": totalMonths -= 120; break;
    case "20Y": return data;
    default:    return data;
  }


  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;

  const final = `${newYear}-${newMonth.toString().padStart(2, '0')}-${compare[2]}`;

  for (let i = 0; i < data.length; i++) {
    if (data[i].date >= final) {
      return data.slice(i);
    }
  }

  return [];
};