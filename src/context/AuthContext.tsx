import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase";

type AuthContextValue = {
  Auth:
  setAuth:
}

const AuthContext = createContext<AuthContextValue> | null>(null);

type AuthContextProviderProps = {
  session: Session | null
  loading: boolean
  children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, useSession] = useState()

  useEffect(()=> {

  }, [])

  return (
    <AuthContext.Provider value={{ Auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const contextValue = useContext(AuthContext)
  if (!contextValue) throw new Error('useAuth must be used inside AuthContextProvider')
  return contextValue
}