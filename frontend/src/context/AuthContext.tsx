import { createContext, useContext, useState } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("AuthContext missing")
  return ctx
}