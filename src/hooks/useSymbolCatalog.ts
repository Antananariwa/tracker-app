import { useState, useEffect } from 'react'

export type StockSymbol = {
  symbol: string
  name: string
  exchange: string
  asset_type: string
  status: string
}

type UseSymbolCatalogResult = {
  data: StockSymbol[] | null
  loading: boolean
  error: Error | null
}

const useSymbolCatalog = (category: 'stocks'): UseSymbolCatalogResult => {
  const [data, setData] = useState<StockSymbol[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)

    const url = `${import.meta.env.VITE_API_URL}/api/symbols/${category}`

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      })
      .then(result => {
        setData(result.data)
      })
      .catch(error => {
        setError(error)
        console.error('Symbol catalog error:', error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [category])

  return { data, loading, error }
}

export default useSymbolCatalog