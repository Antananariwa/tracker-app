export const pickDateLabel = function(timeFrame: string) {
  if (timeFrame === "5Y" || timeFrame === "10Y" || timeFrame === "20Y") {
    return function(d: string) {
      const date = new Date(d);
      return String(date.getFullYear());
    };
  } else if (timeFrame === "3Y" || timeFrame === "1Y" || timeFrame === "YTD" || timeFrame === "6M") {
    return function(d: string) {
      const date = new Date(d);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[date.getMonth()];
      const year = String(date.getFullYear()).slice(-2);
      return month + " " + year;
    };
  } else {
    return function(d: string) {
      const date = new Date(d);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const day = date.getDate();
      const month = months[date.getMonth()];
      return day + " " + month;
    };
  }
};

export const pickTicks = function(data: { date: string }[], timeFrame: string) {
  const tickIndexes: number[] = []
  let lastKey = ""

  for (let i = 0; i < data.length; i++) {
    const point = data[i]
    let key = ""

    if (timeFrame === "5Y" || timeFrame === "10Y" || timeFrame === "20Y") {
      key = point.date.slice(0, 4)
    } else if (timeFrame === "3Y") {
      const month = Number(point.date.slice(5, 7))
      key = point.date.slice(0, 4) + "-" + Math.ceil(month / 3)
    } else if (timeFrame === "1Y" || timeFrame === "YTD" || timeFrame === "6M") {
      key = point.date.slice(0, 7)
    } else {
      return undefined
    }

    if (key !== lastKey) {
      tickIndexes.push(i)
      lastKey = key
    }
  }

  if (tickIndexes.length >= 3) {
    const firstSpan = tickIndexes[1] - tickIndexes[0]
    const normalSpan = tickIndexes[2] - tickIndexes[1]
    if (firstSpan < normalSpan / 2) tickIndexes.shift()
  }

  return tickIndexes.map(i => data[i].date)
};

export const thinData = function<T>(data: T[], maxPoints: number) {
  if (data.length <= maxPoints) return data

  const step = Math.ceil(data.length / maxPoints)
  const thinned: T[] = []

  for (let i = 0; i < data.length; i += step) {
    thinned.push(data[i])
  }

  if (thinned[thinned.length - 1] !== data[data.length - 1]) {
    thinned.push(data[data.length - 1])
  }

  return thinned
};