import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { SupabaseAssetsTable } from '../utils/stockData'

export type UsePortfolioResult = {
  data: SupabaseAssetsTable[] | null
  loading: boolean
  error: Error | null
}

const usePortfolio = (): UsePortfolioResult => {
  const [data, setData] = useState<SupabaseAssetsTable[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)


    supabase
      .from('assets')
      .select('*')
      .then(({ data, error }: { data: SupabaseAssetsTable[] | null; error: Error | null }) => {
        if (error) {
          setError(error)
          console.error('Supabase eror:', error.message)
        } else {
          setData(data)
        }
      })
      .finally(() => {
        setLoading(false)
      })

  }, [])

  return { data, loading, error }
}

export default usePortfolio