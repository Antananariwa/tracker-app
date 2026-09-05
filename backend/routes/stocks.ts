import express, { Request, Response} from 'express'
import { createClient } from '@supabase/supabase-js'
import finnhub from 'finnhub'

const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_KEY)

type AlphaVantageWeeklyResponse = {
  'Weekly Adjusted Time Series'?: {
    [date: string]: {
      '5. adjusted close': string
    }
  }
  'Error Message'?: string
  'Information'?: string
  'Note'?: string
}

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

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days hours in milliseconds
const CACHE_STOCK_QUOTE_TTL_MS =  60 * 60 * 1000 // 1 hour in milliseconds

function isCacheStale(fetchedAt: string) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CACHE_TTL_MS
}

function extractLatestPrice(rawData: AlphaVantageWeeklyResponse) {
  const timeSeries = rawData['Weekly Adjusted Time Series']
  if (!timeSeries) return null

  const dates = Object.keys(timeSeries).sort((a, b) => b.localeCompare(a))
  const latestDate = dates[0]
  if (!latestDate) return null
  const latestBar = timeSeries[latestDate]
  if (!latestBar) return null
  return parseFloat(latestBar['5. adjusted close'])
}

function serveStale(
  res: Response,
  symbol: string,
  cached: { price: number; fetched_at: string; raw_data: AlphaVantageWeeklyResponse }
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

router.get('/:symbol', async (req: Request<{ symbol: string }>, res: Response) => {
  const symbol = req.params.symbol.toUpperCase()

  try {
    const { data: cached, error: cacheError } = await supabase
      .from('stock_price_cache')
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
      `?function=TIME_SERIES_WEEKLY_ADJUSTED` +
      `&symbol=${symbol}` +
      `&apikey=${process.env.ALPHA_VANTAGE_KEY}`

    const avResponse = await fetch(avUrl)
    const rawData = await avResponse.json() as AlphaVantageWeeklyResponse

    if (rawData['Error Message']) {
      return res.status(404).json({
        error: `Symbol "${symbol}" was not found on AlphaVantage.`,
      })
    }

    if (rawData['Information']) {
      console.error('AlphaVantage daily limit reached.')
      if (cached) return serveStale(res, symbol, cached)
      return res.status(429).json({
        error: 'AlphaVantage daily API limit reached. Try again tomorrow.',
      })
    }

    if (rawData['Note']) {
      console.error('AlphaVantage rate limit hit.')
      if (cached) return serveStale(res, symbol, cached)
      return res.status(429).json({
        error: 'AlphaVantage rate limit hit. Wait 60 seconds and try again.',
      })
    }

    const price = extractLatestPrice(rawData)

    if (price === null || isNaN(price)) {
      console.error('Could not extract price from response:', rawData)
      if (cached) return serveStale(res, symbol, cached)
      return res.status(500).json({
        error: 'Price data was missing or unreadable in the API response.',
      })
    }

    const { error: upsertError } = await supabase
      .from('stock_price_cache')
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
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`Unhandled error for ${symbol}:`, message)
  res.status(500).json({ error: 'Internal server error.' })
}
})

function isQuoteCacheStale(fetchedAt: string) {
  if (!fetchedAt) return true
  const age = Date.now() - new Date(fetchedAt).getTime()
  return age > CACHE_STOCK_QUOTE_TTL_MS
}



router.get('/:symbol/quote', async (req: Request<{ symbol: string }>, res: Response) => {
  const symbol = req.params.symbol.toUpperCase()

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