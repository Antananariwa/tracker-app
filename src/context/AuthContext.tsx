import { createContext, useContext, useEffect, useState, ReactNode } from "react"

const AuthContext = createContext<AuthContextValue> | null>(null);

export const AuthContextProvider = ({ children }) => {
  const [Auth, setAuth] = useState()

  return (
    <AuthContext.Provider value={{ Auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
