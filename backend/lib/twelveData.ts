export type TwelveDataSeriesResponse = {
  meta?: {
    symbol: string
    interval: string
    currency: string
    exchange_timezone: string
    exchange: string
    mic_code: string
    type: string
  }
  values?: {
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }[]
  status: 'ok' | 'error'
  code?: number
  message?: string
}

type QueueItem = {
  symbol: string
  promise: Promise<TwelveDataSeriesResponse>
  resolve: (data: TwelveDataSeriesResponse) => void
  reject: (error: Error) => void
}

const CALLS_PER_MINUTE = 7

const callTimes: number[] = []
const urgentQueue: QueueItem[] = []
const backgroundQueue: QueueItem[] = []
const pendingItems: { [symbol: string]: QueueItem } = {}

function callsInLastMinute() {
  const oneMinuteAgo = Date.now() - 60 * 1000
  while (callTimes.length > 0) {
    const oldest = callTimes[0]
    if (oldest === undefined || oldest >= oneMinuteAgo) break
    callTimes.shift()
  }
  return callTimes.length
}

async function fetchDailySeries(symbol: string) {
  const url =
    `https://api.twelvedata.com/time_series` +
    `?symbol=${symbol}` +
    `&interval=1day` +
    `&outputsize=5000` +
    `&apikey=${process.env.TWELVE_DATA_KEY}`

  const response = await fetch(url)
  return await response.json() as TwelveDataSeriesResponse
}

function processQueue() {
  if (callsInLastMinute() >= CALLS_PER_MINUTE) return

  const item = urgentQueue.shift() ?? backgroundQueue.shift()
  if (!item) return

  callTimes.push(Date.now())
  console.log(`[TWELVE DATA] ${item.symbol} (urgent waiting: ${urgentQueue.length}, background waiting: ${backgroundQueue.length})`)

  fetchDailySeries(item.symbol)
    .then(item.resolve)
    .catch(item.reject)
}

setInterval(processQueue, 500)

export function requestDailySeries(symbol: string, urgent: boolean) {
  const existing = pendingItems[symbol]
  if (existing) {
    if (urgent) {
      const index = backgroundQueue.indexOf(existing)
      if (index !== -1) {
        backgroundQueue.splice(index, 1)
        urgentQueue.push(existing)
      }
    }
    return existing.promise
  }

  let resolve!: (data: TwelveDataSeriesResponse) => void
  let reject!: (error: Error) => void
  const promise = new Promise<TwelveDataSeriesResponse>((res, rej) => {
    resolve = res
    reject = rej
  })

  const item: QueueItem = { symbol, promise, resolve, reject }
  pendingItems[symbol] = item

  if (urgent) urgentQueue.push(item)
  else backgroundQueue.push(item)

  promise.then(
    () => { delete pendingItems[symbol] },
    () => { delete pendingItems[symbol] }
  )

  return promise
}