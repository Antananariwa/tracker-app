import { createContext, useEffect } from "react"

const AuthContext = createcontext();

const AuthContextProvider = () => {
  useEffect(()=>{
    setAuthContext = supabase.auth.getSession()
  }),[]

  return (
    <div>
      
    </div>
  )
}

export default AuthContext
