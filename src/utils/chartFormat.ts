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