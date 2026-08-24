import { useState, useEffect } from 'react'
import type { AlphaVantageWeeklyResponse } from '../utils/stockData'

type UseBackendStockResult = {
  data: { [symbol: string]: AlphaVantageWeeklyResponse | null } | null
  loading: boolean
  error: Error | null
}

const useBackendStock = (symbols: string[]): UseBackendStockResult => {
  const [data, setData] = useState<{ [symbol: string]: AlphaVantageWeeklyResponse | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (symbols.length === 0) return;

    let allSymbolsData: { [symbol: string]: AlphaVantageWeeklyResponse | null } = {};

    for ( let i=0; i < symbols.length; i++ ){
      const url = `${import.meta.env.VITE_API_URL}/api/stocks/${symbols[i]}`


      setLoading(true)

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .then(result => {
          allSymbolsData[symbols[i]] = result //creates key(symbol): value(result) pair
          setData({...allSymbolsData})
        })
        .catch(error => {
          allSymbolsData[symbols[i]] = null
          setData({...allSymbolsData})
          console.error('Error:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [symbols.join(",")])

  return { data, loading, error }
}

export default useBackendStock