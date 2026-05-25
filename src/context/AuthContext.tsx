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
  const [Auth, setAuth] = useState()

  return (
    <AuthContext.Provider value={{ Auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
