import { useEffect, useState } from "react"
import type { StockQuote } from "../utils/stockData"

type usePortfolioStockAssetsPricesResult = {
  data: { [symbol: string]: StockQuote | null } | null
  loading: boolean
  error: Error | null
}

const usePortfolioStockAssetsPrices = (ownedStocks: string[]): usePortfolioStockAssetsPricesResult => {
  const [data, setData] = useState<{ [symbol: string]: StockQuote | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {
    if (!ownedStocks) return

    let allQuotes: { [symbol: string]: StockQuote | null }= {};

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
          allQuotes[ownedStocks[i]] = result
          setData({...allQuotes})
        })
        .catch(error => {
          setError(error)
          console.error('Error:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [ownedStocks])

  return {data, loading, error }
}

export default usePortfolioStockAssetsPrices
