import { useState, useEffect } from 'react'
import type { StockQuote } from '../utils/stockData' 

type UseBackendStockQuoteResult = {
  data: StockQuote | null
  loading: boolean
  error: Error | null
}

const useBackendStockQuote = (symbol: string): UseBackendStockQuoteResult => {
  const [data, setData] = useState<StockQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!symbol) return

    const url = `${import.meta.env.VITE_API_URL}/api/stocks/${symbol}/quote`

    setLoading(true)

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      })
      .then(result => {
        setData(result)
      })
      .catch(error => {
        setError(error)
        console.error('Error:', error)
      })
      .finally(() => {
        setLoading(false)
      })

  }, [symbol])

  return { data, loading, error }
}

export default useBackendStockQuote