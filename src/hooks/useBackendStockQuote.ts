import { useState, useEffect } from 'react'
import type FinnhubDataResponse 

type FinnhubDataResponse = {
  data: AlphaVantageWeeklyResponse | null
  loading: boolean
  error: Error | null
}

const useBackendStockQuote = (symbol: string): UseBackendStockResult => {
  const [data, setData] = useState<AlphaVantageWeeklyResponse | null>(null)
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

export default useBackendStockQuote