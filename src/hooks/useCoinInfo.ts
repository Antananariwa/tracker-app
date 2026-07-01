import { useState, useEffect } from 'react'
import type { CoinGeckoInfoResponse } from '../utils/cryptoData'

export type UseCoinInfoResult = {
  data: CoinGeckoInfoResponse | null
  loading: boolean
  error: Error | null
}

const useCoinInfo = (coinId: string): UseCoinInfoResult => {
  const [data, setData] = useState<CoinGeckoInfoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!coinId) return

    const url = `${import.meta.env.VITE_API_URL}/api/crypto/${coinId}/info`

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

  }, [coinId])

  return { data, loading, error }
}

export default useCoinInfo