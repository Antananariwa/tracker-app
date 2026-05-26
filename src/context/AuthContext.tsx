import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type AuthContextValue = {
  Auth:
  setAuth:
}

const AuthContext = createContext<AuthContextValue> | null>(null);

type ThemeProviderProps = {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: ThemeProviderProps) => {
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
  const currentState = supabase.auth.getSession()
  return currentState
}