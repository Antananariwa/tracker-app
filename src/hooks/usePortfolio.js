import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const usePortfolio = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)


    supabase
      .from('assets')
      .select('*')
      .then(({ data, error }) => {
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