declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL: string
    SUPABASE_SERVICE_KEY: string
    ALPHA_VANTAGE_KEY: string
    PORT?: string
  }
}