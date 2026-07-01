import { useState, useEffect } from 'react'
import type { CoinGeckoResponse } from '../utils/cryptoData'

type UseBackendCryptoResult = {
  data: CoinGeckoResponse | null
  loading: boolean
  error: Error | null
}

const useBackendCrypto = (coin_id: string): UseBackendCryptoResult => {
  const [data, setData] = useState<CoinGeckoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!coin_id) return

    const url = `${import.meta.env.VITE_API_URL}/api/crypto/${coin_id}`

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

  }, [coin_id])

  return { data, loading, error }
}

export default useBackendCrypto