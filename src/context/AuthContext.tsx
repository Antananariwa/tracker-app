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
  const contextValue = useContext(AuthContext)
  if (!contextValue) throw new Error('useAuth must be used inside AuthContextProvider')
  return contextValue
}