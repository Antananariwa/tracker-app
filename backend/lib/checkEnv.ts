const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'TWELVE_DATA_KEY', 'FINNHUB_KEY', 'COINGECKO_API_KEY']

for (const name of requiredEnv) {
  if (!process.env[name]) {
    console.error(`Missing environment variable: ${name}`)
    process.exit(1)
  }
}