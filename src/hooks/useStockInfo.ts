import { useState, useEffect } from 'react'
import type { StockInfoResponse } from '../utils/stockData'

type UseStockInfoResult = {
  data: StockInfoResponse | null
  loading: boolean
  error: Error | null
}

const useStockInfo = (symbol: string): UseStockInfoResult => {
  const [data, setData] = useState<StockInfoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!symbol) return

    const url = `${import.meta.env.VITE_API_URL}/api/stocks/${symbol}/info`

    setLoading(true)
    setError(null)
    setData(null)

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      })
      .then(result => {
        setData(result.raw_data)
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

export default useStockInfo