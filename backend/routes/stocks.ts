const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days hours in milliseconds

function isCacheStale(fetchedAt) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CACHE_TTL_MS
}

function extractLatestPrice(rawData) {
  const timeSeries = rawData['Weekly Time Series']
  if (!timeSeries) return null

  const dates = Object.keys(timeSeries).sort((a, b) => b.localeCompare(a))
  const latestDate = dates[0]
  const latestBar = timeSeries[latestDate]
  return parseFloat(latestBar['4. close'])
}

router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase()

  try {
    const { data: cached, error: cacheError } = await supabase
      .from('price_cache')
      .select('*')
      .eq('symbol', symbol)
      .single()

    if (cacheError && cacheError.code !== 'PGRST116') {
      console.error('Supabase cache read error:', cacheError.message)
      throw cacheError
    }

    if (cached && !isCacheStale(cached.fetched_at)) {
      console.log(`[CACHE HIT] ${symbol}`)
      return res.json({
        symbol,
        price: cached.price,
        source: 'cache',
        fetched_at: cached.fetched_at,
        raw_data: cached.raw_data,
      })
    }

    console.log(`[API FETCH] ${symbol}`)

    const avUrl =
      `https://www.alphavantage.co/query` +
      `?function=TIME_SERIES_WEEKLY` +
      `&symbol=${symbol}` +
      `&apikey=${process.env.ALPHA_VANTAGE_KEY}`

    const avResponse = await fetch(avUrl)
    const rawData = await avResponse.json()

    if (rawData['Error Message']) {
      return res.status(404).json({
        error: `Symbol "${symbol}" was not found on AlphaVantage.`,
      })
    }

    if (rawData['Information']) {
      console.error('AlphaVantage daily limit reached.')
      return res.status(429).json({
        error: 'AlphaVantage daily API limit reached. Try again tomorrow.',
      })
    }

    if (rawData['Note']) {
      console.error('AlphaVantage rate limit hit.')
      return res.status(429).json({
        error: 'AlphaVantage rate limit hit. Wait 60 seconds and try again.',
      })
    }

    const price = extractLatestPrice(rawData)

    if (price === null || isNaN(price)) {
      console.error('Could not extract price from response:', rawData)
      return res.status(500).json({
        error: 'Price data was missing or unreadable in the API response.',
      })
    }

    const { error: upsertError } = await supabase
      .from('price_cache')
      .upsert(
        {
          symbol,
          price,
          category: 'stock',
          fetched_at: new Date().toISOString(),
          raw_data: rawData,
        },
        { onConflict: 'symbol' }
      )

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError.message)
      throw upsertError
    }

    return res.json({
      symbol,
      price,
      source: 'api',
      fetched_at: new Date().toISOString(),
      raw_data: rawData,
    })

  } catch (error) {
    console.error(`Unhandled error for ${symbol}:`, error.message)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

module.exports = router