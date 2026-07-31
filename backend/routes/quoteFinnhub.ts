import express, { Request, Response} from 'express'
import finnhub from 'finnhub'


const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_KEY
const finnhubClient = new finnhub.DefaultApi()

type FinnhubDataResponse = {
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



router.get('/:symbol/quote', (req: Request<{ symbol: string }>, res: Response) => {
  const symbol = req.params.symbol.toUpperCase()

  finnhubClient.quote(symbol, (error: Error | null, data: FinnhubDataResponse) => {
    if (error) {
      return res.status(500).json({ error: 'Finnhub Quote API Error' })
    }

    res.json({
      current_price: data.c,
      change: data.d,
      percent_change: data.dp,
      high_price_of_the_day: data.h,
      low_price_of_the_day: data.l,
      open_price_of_the_day: data.o,
      previous_close_price: data.pc,
      time: data.t,
    })
  })
})

export default router