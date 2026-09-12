import express from 'express'
import { createClient } from '@supabase/supabase-js'

type TwelveDataStockRow = {
  symbol: string
  name: string
  currency: string
  exchange: string
  mic_code: string
  country: string
  type: string
}

type TwelveDataStocksResponse = {
  data?: TwelveDataStockRow[]
  status: 'ok' | 'error'
  message?: string
}

type CoinGeckoListingRow = {
  id: string
  symbol: string
  name: string
}

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const STOCK_CATALOG_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
const CRYPTO_CATALOG_TTL_MS = 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds

function isCatalogStale(fetchedAt: string | null, catalog_TTL: number) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > catalog_TTL
}

router.get('/stocks', async (_req, res) => {
  try {
    const { data: probe, error: probeError } = await supabase
      .from('stock_twelvedata_listings')
      .select('fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(1)

    if (probeError) {
      console.error('Supabase probe error:', probeError.message)
      throw probeError
    }

    const latestFetchedAt = probe[0]?.fetched_at ?? null
    if (!isCatalogStale(latestFetchedAt, STOCK_CATALOG_TTL_MS)) {
      console.log('[CATALOG HIT]')

      const { data: rows, error: readError } = await supabase
        .from('stock_twelvedata_listings')
        .select('symbol, name, exchange, type')

      if (readError) {
        console.error('Supabase read error:', readError.message)
        throw readError
      }

      return res.json({ source: 'cache', count: rows.length, data: rows })
    }

    console.log('[CATALOG REFRESH]')

    const tdUrl =
      `https://api.twelvedata.com/stocks` +
      `?country=United%20States` +
      `&apikey=${process.env.TWELVE_DATA_KEY}`

    const tdResponse = await fetch(tdUrl)
    const rawData = await tdResponse.json() as TwelveDataStocksResponse

    if (rawData.status === 'error' || !rawData.data) {
      console.error('Twelve Data catalog error:', rawData.message)
      return res.status(502).json({ error: 'Stock catalog provider returned an error.' })
    }

    const seen: { [symbol: string]: boolean } = {}
    const cleanedRows = []
    const fetchedAt = new Date().toISOString()

    for (const row of rawData.data) {
      if (seen[row.symbol]) continue
      seen[row.symbol] = true
      cleanedRows.push({
        symbol: row.symbol,
        name: row.name,
        exchange: row.exchange || null,
        type: row.type || null,
        currency: row.currency || null,
        mic_code: row.mic_code || null,
        fetched_at: fetchedAt,
      })
    }

    const CHUNK = 2000
    for (let i = 0; i < cleanedRows.length; i += CHUNK) {
      const chunk = cleanedRows.slice(i, i + CHUNK)
      const { error: upsertError } = await supabase
        .from('stock_twelvedata_listings')
        .upsert(chunk, { onConflict: 'symbol' })

      if (upsertError) {
        console.error('Supabase upsert error:', upsertError.message)
        throw upsertError
      }
    }

    console.log(`[CATALOG REFRESH] Upserted ${cleanedRows.length} rows`)

    const responseRows = cleanedRows.map(row => ({
      symbol: row.symbol,
      name: row.name,
      exchange: row.exchange,
      type: row.type,
    }))

    return res.json({ source: 'api', count: responseRows.length, data: responseRows })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unhandled error:', message)
    res.status(500).json({ error: 'Internal server error.' })
  }
})


router.get('/crypto', async (_req, res) => {
  try {
    const { data: probe, error: probeError } = await supabase
      .from('crypto_coingecko_listings')
      .select('fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(1)

    if (probeError) {
      console.error('Supabase probe error:', probeError.message)
      throw probeError
    }

    const latestFetchedAt = probe[0]?.fetched_at ?? null
    if (!isCatalogStale(latestFetchedAt, CRYPTO_CATALOG_TTL_MS)) {
      console.log('[CATALOG HIT]')

      const { data: rows, error: readError } = await supabase
        .from('crypto_coingecko_listings')
        .select('coin_id, symbol, name')

      if (readError) {
        console.error('Supabase read error:', readError.message)
        throw readError
      }

      return res.json({ source: 'cache', count: rows.length, data: rows })
    }

    console.log('[CATALOG REFRESH]')

    const cgUrl = `https://api.coingecko.com/api/v3/coins/list`

    const cgResponse = await fetch(cgUrl)
    const rawRows = await cgResponse.json() as CoinGeckoListingRow[]

  const cleanedRows = rawRows.map(row => ({
    coin_id: row.id,
    symbol: row.symbol,
    name: row.name,
    fetched_at: new Date().toISOString(),
  }))

  const { error: upsertError } = await supabase
    .from('crypto_coingecko_listings')
    .upsert(cleanedRows, { onConflict: 'coin_id' })

  if (upsertError) {
    console.error('Supabase upsert error:', upsertError.message)
    throw upsertError
  }

  console.log(`[CATALOG REFRESH] Upserted ${cleanedRows.length} rows`)

  const responseRows = cleanedRows.map(row => ({
    coin_id: row.coin_id,
    symbol: row.symbol,
    name: row.name,
  }))

  return res.json({ source: 'api', count: responseRows.length, data: responseRows })

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('Unhandled error:', message)
      res.status(500).json({ error: 'Internal server error.' })
    }
})


export default router