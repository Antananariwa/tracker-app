import express, { Request, Response} from 'express'
import { createClient } from '@supabase/supabase-js'
import finnhub from 'finnhub'
import { requestDailySeries, type TwelveDataSeriesResponse } from '../lib/twelveData'

const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_KEY)

type FinnhubQuoteDataResponse = {
  'c': number /** Current price */
  'd': number /** Change */
  'dp': number /** Percent change */
  'h': number /** High price of the day */
  'l': number /** Low price of the day */
  'o': number /** Open price of the day */
  'pc': number /** Previous close price */
  't': number /** Time */
}

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // time in milliseconds
const CACHE_STOCK_QUOTE_TTL_MS =  60 * 60 * 1000 // 1 hour in milliseconds

function isCacheStale(fetchedAt: string) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CACHE_TTL_MS
}


function extractLatestPrice(rawData: TwelveDataSeriesResponse) {
  const values = rawData.values
  if (!values || values.length === 0) return null

  const sorted = [...values].sort((a, b) => b.datetime.localeCompare(a.datetime))
  const latest = sorted[0]
  if (!latest) return null
  return parseFloat(latest.close)
}

function isValidSymbol(symbol: string) {
  return /^[A-Z0-9.\-]{1,10}$/.test(symbol)
}

async function saveToCache(symbol: string, price: number, rawData: TwelveDataSeriesResponse) {
  const { error } = await supabase
    .from('stock_history_cache')
    .upsert(
      {
        symbol,
        price,
        fetched_at: new Date().toISOString(),
        raw_data: rawData,
      },
      { onConflict: 'symbol' }
    )

  if (error) throw error
}

function refreshInBackground(symbol: string) {
  requestDailySeries(symbol, false)
    .then(async (rawData) => {
      if (rawData.status === 'error') {
        console.error(`[BACKGROUND REFRESH] ${symbol} failed:`, rawData.message)
        return
      }
      const price = extractLatestPrice(rawData)
      if (price === null || isNaN(price)) {
        console.error(`[BACKGROUND REFRESH] ${symbol} had no readable price`)
        return
      }
      await saveToCache(symbol, price, rawData)
      console.log(`[BACKGROUND REFRESH] ${symbol} saved`)
    })
    .catch((error) => {
      console.error(`[BACKGROUND REFRESH] ${symbol} error:`, error)
    })
}

async function refreshStaleRows() {
  const { data: rows, error } = await supabase
    .from('stock_history_cache')
    .select('symbol, fetched_at')

  if (error || !rows) return

  for (const row of rows) {
    if (isCacheStale(row.fetched_at)) refreshInBackground(row.symbol)
  }
}

setInterval(refreshStaleRows, 60 * 60 * 1000)
refreshStaleRows()

function serveStale(
  res: Response,
  symbol: string,
  cached: { price: number; fetched_at: string; raw_data: TwelveDataSeriesResponse }
) {
  console.log(`[STALE CACHE] ${symbol}`)
  return res.json({
    symbol,
    price: cached.price,
    source: 'stale-cache',
    fetched_at: cached.fetched_at,
    raw_data: cached.raw_data,
  })
}



function isQuoteCacheStale(fetchedAt: string) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CACHE_STOCK_QUOTE_TTL_MS
}

router.get('/:symbol', async (req: Request<{ symbol: string }>, res: Response) => {
  const symbol = req.params.symbol.toUpperCase()

  if (!isValidSymbol(symbol)) {
    return res.status(400).json({ error: 'Invalid symbol.' })
  }

  try {
    const { data: cached, error: cacheError } = await supabase
      .from('stock_history_cache')
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

    if (cached) {
      refreshInBackground(symbol)
      return serveStale(res, symbol, cached)
    }

    console.log(`[API FETCH] ${symbol}`)

    const rawData = await requestDailySeries(symbol, true)

    if (rawData.status === 'error') {
      if (rawData.code === 429) {
        return res.status(429).json({
          error: 'Stock data provider limit hit. Wait a minute and try again.',
        })
      }
      return res.status(404).json({
        error: `Symbol "${symbol}" was not found.`,
      })
    }

    const price = extractLatestPrice(rawData)

    if (price === null || isNaN(price)) {
      console.error('Could not extract price from response:', rawData)
      return res.status(500).json({
        error: 'Price data was missing or unreadable in the API response.',
      })
    }

    await saveToCache(symbol, price, rawData)

    return res.json({
      symbol,
      price,
      source: 'api',
      fetched_at: new Date().toISOString(),
      raw_data: rawData,
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Unhandled error for ${symbol}:`, message)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

router.get('/:symbol/quote', async (req: Request<{ symbol: string }>, res: Response) => {
  const symbol = req.params.symbol.toUpperCase()

  if (!isValidSymbol(symbol)) {
    return res.status(400).json({ error: 'Invalid symbol.' })
  }

  try {
    // check Supabase for cache, fetch is possible
    const { data: cached, error: cacheError } = await supabase
      .from('stock_quote_cache')
      .select('*')
      .eq('symbol', symbol)
      .single()

    if (cacheError && cacheError.code !== 'PGRST116') {
      console.error('Supabase cache read error:', cacheError.message)
      throw cacheError
    }

    if (cached && !isQuoteCacheStale(cached.fetched_at)) {
      console.log(`[CACHE HIT] ${symbol}`)
      return res.json({
        current_price:  cached.raw_data.c,
        change: cached.raw_data.d,
        percent_change: cached.raw_data.dp,
        high_price_of_the_day: cached.raw_data.h,
        low_price_of_the_day: cached.raw_data.l,
        open_price_of_the_day: cached.raw_data.o,
        previous_close_price: cached.raw_data.pc,
        time: cached.raw_data.t,
      })
    }

    // fetch directly from Finnhub if cache failed
    const finnhubQuotePromise = function(symbol: string) {
      return new Promise<FinnhubQuoteDataResponse>((resolve, reject) => {
        finnhubClient.quote(symbol, (error: Error | null, data: FinnhubQuoteDataResponse) => {
          if (error) reject(error);
          else resolve(data);
        });
      });
    };

    const rawData = await finnhubQuotePromise(symbol)

    console.log(`[API FETCH] ${symbol}`)

    const currentPrice = rawData.c

    if (currentPrice === null || isNaN(currentPrice)) {
      console.error('Could not extract price from response:', rawData)
      return res.status(500).json({
        error: 'Price data was missing or unreadable in the API response.',
      })
    }

    //upload API response to Supabase for cache purpose
    const { error: upsertError } = await supabase
      .from('stock_quote_cache')
      .upsert(
        {
          symbol,
          current_price: currentPrice,
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
      current_price:  rawData.c,
      change: rawData.d,
      percent_change: rawData.dp,
      high_price_of_the_day: rawData.h,
      low_price_of_the_day: rawData.l,
      open_price_of_the_day: rawData.o,
      previous_close_price: rawData.pc,
      time: rawData.t,
    })


  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Unhandled error for ${symbol}:`, message)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

export default router