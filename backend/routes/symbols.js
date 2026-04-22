const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const ALPHAVANTAGE_SYMBOLS_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds


router.get('/stocks', async (req, res) => {
  try {

  }
})