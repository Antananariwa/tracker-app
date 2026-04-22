const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CATALOG_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

function isCatalogStale(fetchedAt) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CATALOG_TTL_MS
}

router.get('/stocks', async (req, res) => {
  try {
    const { data: probe, error: probeError } = await supabase
      .from('alphavantage_listings')
      .select('fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(1)

    if (probeError) {
      console.error('Supabase probe error:', probeError.message)
      throw probeError
    }

    const latestFetchedAt = probe.length > 0 ? probe[0].fetched_at : null

    if (!isCatalogStale(latestFetchedAt)) {
      console.log('[CATALOG HIT]')

      const { data: rows, error: readError } = await supabase
        .from('alphavantage_listings')
        .select('symbol, name, exchange, asset_type, status')

      if (readError) {
        console.error('Supabase read error:', readError.message)
        throw readError
      }

      return res.json({ source: 'cache', count: rows.length, data: rows })
    }

    console.log('[CATALOG REFRESH]')

    const avUrl =
      `https://www.alphavantage.co/query` +
      `?function=LISTING_STATUS` +
      `&apikey=${process.env.ALPHA_VANTAGE_KEY}`

    const avResponse = await fetch(avUrl)
    const csvText = await avResponse.text()

    console.log('CSV length:', csvText.length)
    console.log('First 300 chars:', csvText.slice(0, 300))

    return res.json({ source: 'debug', message: 'Fetched but not yet parsed or stored.' })

  } catch (error) {
    console.error('Unhandled error:', error.message)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

module.exports = router