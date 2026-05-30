import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { parse } from 'csv-parse/sync'

type AlphaVantageListingRow = {
  symbol: string
  name: string
  exchange: string
  assetType: string
  ipoDate: string
  delistingDate: string
  status: string
}

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CATALOG_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

function isCatalogStale(fetchedAt: string | null) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CATALOG_TTL_MS
}

router.get('/stocks', async (_req, res) => {
  try {
    const { data: probe, error: probeError } = await supabase
      .from('stock_alphavantage_listings')
      .select('fetched_at')
      .order('fetched_at', { ascending: false })
      .limit(1)

    if (probeError) {
      console.error('Supabase probe error:', probeError.message)
      throw probeError
    }

    const latestFetchedAt = probe[0]?.fetched_at ?? null
    if (!isCatalogStale(latestFetchedAt)) {
      console.log('[CATALOG HIT]')

      const { data: rows, error: readError } = await supabase
        .from('stock_alphavantage_listings')
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

    const rawRows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as AlphaVantageListingRow[]

const cleanedRows = rawRows.map(row => ({
  symbol: row.symbol,
  name: row.name,
  exchange: row.exchange || null,
  asset_type: row.assetType || null,
  ipo_date: row.ipoDate && row.ipoDate !== 'null' ? row.ipoDate : null,
  delisting_date: row.delistingDate && row.delistingDate !== 'null' ? row.delistingDate : null,
  status: row.status || null,
  fetched_at: new Date().toISOString(),
}))

const { error: upsertError } = await supabase
  .from('alphavantage_listings')
  .upsert(cleanedRows, { onConflict: 'symbol' })

if (upsertError) {
  console.error('Supabase upsert error:', upsertError.message)
  throw upsertError
}

console.log(`[CATALOG REFRESH] Upserted ${cleanedRows.length} rows`)

const responseRows = cleanedRows.map(row => ({
  symbol: row.symbol,
  name: row.name,
  exchange: row.exchange,
  asset_type: row.asset_type,
  status: row.status,
}))

return res.json({ source: 'api', count: responseRows.length, data: responseRows })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Unhandled error:', message)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

export default router