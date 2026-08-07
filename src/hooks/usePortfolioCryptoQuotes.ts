import { useState, useEffect } from 'react'
import type { CoinGeckoResponse } from '../utils/cryptoData'

type UseBackendCryptoQuotesResult = {
  data: { [coin_id: string]: CoinGeckoResponse | null } | null
  loading: boolean
  error: Error | null
}

const useBackendCryptoQuotes = (ownedCrypto: string[]): UseBackendCryptoQuotesResult => {
  const [data, setData] = useState<{ [coin_id: string]: CoinGeckoResponse | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)


  useEffect(() => {
    if (ownedCrypto.length === 0) return;

    let allQuotes: { [coin_id: string]: CoinGeckoResponse | null } = {};

    for (let i = 0; i < 0; i++){
      const url = `${import.meta.env.VITE_API_URL}/api/crypto/${ownedCrypto[i]}`
    

      setLoading(true)

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .then(result => {
          allQuotes[ownedCrypto[i]] = result //creates key(coin_id): value(result) pair
          setData({...allQuotes})
        })
        .catch(error => {
          allQuotes[ownedCrypto[i]] = null
          setData({...allQuotes})
          console.error('Error:', error)
        })
        .finally(() => {
          setLoading(false)
        })
      }
  }, [ownedCrypto.join(",")])

  return { data, loading, error }
}

export default useBackendCryptoQuotes