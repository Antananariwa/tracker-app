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
    const { data, error } = await supabase.auth.getSession()
    setSession(data)

    const { data } = supabase.auth.onAuthStateChange( session ) => {

      setSession(session)
    })

    return () => subscription.unsubscribe()
    
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthContextProvider')
  return context
}