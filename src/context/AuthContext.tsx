import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase";

type AuthContextValue = {
  session: Session | null
  loading: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=> {

  }, [])

  return (
    <AuthContext.Providsssser value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const contextValue = useContext(AuthContext)
  if (!contextValue) throw new Error('useAuth must be used inside AuthContextProvider')
  return contextValue
}