import { useState, useEffect } from 'react'
import type { CoinGeckoResponse } from '../utils/cryptoData'

type UseBackendPortfolioCryptoResult = {
  data: { [coinId: string]: CoinGeckoResponse | null } | null
  loading: boolean
  error: Error | null
}


const useBackendPortfolioCrypto = (coinIds: string[]): UseBackendPortfolioCryptoResult => {
  const [data, setData] = useState<{ [coinId: string]: CoinGeckoResponse | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (coinIds.length === 0) return;

    let allCoinsData: { [coinId: string]: CoinGeckoResponse | null } = {};

    for ( let i=0; i < coinIds.length; i++ ){
      const url = `${import.meta.env.VITE_API_URL}/api/crypto/${coinIds[i]}`

      setLoading(true)

      setTimeout(() => {
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`)
            }
            return response.json()
          })
          .then(result => {
            allCoinsData[coinIds[i]] = result.raw_data
            setData({...allCoinsData})
          })
          .catch(error => {
            allCoinsData[coinIds[i]] = null
            setData({...allCoinsData})
            console.error('Error:', error)
          })
          .finally(() => {
            setLoading(false)
          })
      }, i * 1200)
    }
  }, [coinIds.join(",")])

  return { data, loading, error }
}

export default useBackendPortfolioCrypto