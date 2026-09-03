import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import stocksRouter from './routes/stocks'
import catalogRouter from './routes/catalog'
import cryptoRouter from './routes/crypto'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}))

app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)


// app.use(arbitrary suffix, specific paths defined in the individual routes, names comes from imports)
// full path is done by putting both together
app.use('/api/stocks', stocksRouter)
app.use('/api/catalog', catalogRouter)
app.use('/api/crypto', cryptoRouter)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})


app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`)
})