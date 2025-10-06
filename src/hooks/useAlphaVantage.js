import { useState, useEffect } from 'react'

const useAlphaVantage = (functionName, symbol, interval = null, outputsize = null, datatype = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=demo`;
    
    if (interval) {
      url += `&interval=${interval}`;
    }
    if (outputsize) {
      url += `&outputsize=${outputsize}`;
    }
    if (datatype) {
      url += `&datatype=${datatype}`;
    }

    setLoading(true);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(result => {
        setData(result)
      })
      .catch(error => {
        setError(error.message)
        console.error('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [functionName, symbol, interval, outputsize, datatype]);

  return { data, loading, error };
};


export default useAlphaVantage
