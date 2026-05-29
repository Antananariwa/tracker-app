import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { SupabaseAssetsTable } from '../utils/stockData'
import { useAuth } from '../context/AuthContext'

export type UsePortfolioResult = {
  data: SupabaseAssetsTable[] | null
  loading: boolean
  error: Error | null
}

const usePortfolio = (): UsePortfolioResult => {
  const { session } = useAuth()
  const [data, setData] = useState<SupabaseAssetsTable[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)

    if (!session){
      setData(null)
      setLoading(false)
      return
    }

    supabase
      .from('assets')
      .select('*')
      .then(({ data, error }: { data: SupabaseAssetsTable[] | null; error: Error | null }) => {
        if (error) {
          setError(error)
          console.error('Supabase error:', error.message)
        } else {
          setData(data)
        }
        setLoading(false)
      })

  }, [session])

  return { data, loading, error }
}

export default usePortfolio