import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import stocksRouter from './routes/stocks'
import symbolsRouter from './routes/symbols'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}))

app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)


app.use('/api/stocks', stocksRouter)
app.use('/api/symbols', symbolsRouter)

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})


app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`)
})