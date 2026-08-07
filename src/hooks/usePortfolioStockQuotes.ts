import { useEffect, useState } from "react"
import type { StockQuote } from "../utils/stockData"

export type usePortfolioStockQuotesResult = {
  data: { [symbol: string]: StockQuote | null } | null
  loading: boolean
  error: Error | null
}

const usePortfolioStockQuotes = (ownedStocks: string[]): usePortfolioStockQuotesResult => {
  const [data, setData] = useState<{ [symbol: string]: StockQuote | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {
    if (ownedStocks.length === 0) return;

    let allQuotes: { [symbol: string]: StockQuote | null } = {};

    for (let i = 0; i < ownedStocks.length; i++) {
      const url = `${import.meta.env.VITE_API_URL}/api/stocks/${ownedStocks[i]}/quote`

      setLoading(true)

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .then(result => {
          allQuotes[ownedStocks[i]] = result //creates key(symbol): value(result) pair
          setData({...allQuotes})
        })
        .catch(error => {
          allQuotes[ownedStocks[i]] = null
          setData({...allQuotes})
          console.error('Error:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [ownedStocks.join(",")])

  return {data, loading, error }
}

export default usePortfolioStockQuotes
