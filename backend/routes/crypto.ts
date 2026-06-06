import express, { Request, Response} from 'express'
import { createClient } from '@supabase/supabase-js'

type CoinGeckoResponse = {
  "prices":        [number, number][],
  "market_caps":   [number, number][],
  "total_volumes": [number, number][],
}

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CACHE_TTL_MS = 3 * 60 * 1000 // 3 minutes in milliseconds

function isCacheStale(fetchedAt: string) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CACHE_TTL_MS
}

function extractLatestPrice(rawData: CoinGeckoResponse) {
  const prices = rawData['prices']
  return prices[prices.length - 1]?.[1] ?? null
}

router.get('/:coin_id', async (req: Request<{ coin_id: string }>, res: Response) => {
  const coin_id = req.params.coin_id

  try {
    const { data: cached, error: cacheError } = await supabase
      .from('crypto_price_cache')
      .select('*')
      .eq('coin_id', coin_id)
      .single()

    if (cacheError && cacheError.code !== 'PGRST116') {
      console.error('Supabase cache read error:', cacheError.message)
      throw cacheError
    }

    if (cached && !isCacheStale(cached.fetched_at)) {
      console.log(`[CACHE HIT] ${coin_id}`)
      return res.json({
        coin_id: coin_id,
        price: cached.price,
        source: 'cache',
        fetched_at: cached.fetched_at,
        raw_data: cached.raw_data,
      })
    }

    console.log(`[API FETCH] ${coin_id}`)

    const cgUrl =
      `https://api.coingecko.com/api/v3/coins` +
      `/${coin_id}` +
      `/market_chart?vs_currency=usd&days=365` +
      `&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`

    const cgResponse = await fetch(cgUrl)
    if (!cgResponse.ok) {
      if (cgResponse.status === 404) return res.status(404).json({ error: `Coin "${coin_id}" not found.` })
      if (cgResponse.status === 429) return res.status(429).json({ error: 'CoinGecko rate limit hit. Try again shortly.' })
      return res.status(502).json({ error: 'CoinGecko request failed.' })
    }
    const rawData = await cgResponse.json() as CoinGeckoResponse

    const latestPrice = extractLatestPrice(rawData)

    if (latestPrice === null || isNaN(latestPrice)) {
      console.error('Could not extract price from response:', rawData)
      return res.status(500).json({
        error: 'Price data was missing or unreadable in the API response.',
      })
    }

    const { error: upsertError } = await supabase
      .from('crypto_price_cache')
      .upsert(
        {
          coin_id: coin_id,
          price: latestPrice,
          fetched_at: new Date().toISOString(),
          raw_data: rawData,
        },
        { onConflict: 'coin_id' }
      )

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError.message)
      throw upsertError
    }

    return res.json({
      coin_id,
      price: latestPrice,
      source: 'api',
      fetched_at: new Date().toISOString(),
      raw_data: rawData,
    })

} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`Unhandled error for ${coin_id}:`, message)
  res.status(500).json({ error: 'Internal server error.' })
}
})

export default router