import { useState, useEffect } from 'react'

const useCatalog = (category) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

export default useCatalog