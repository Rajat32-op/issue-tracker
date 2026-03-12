import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

type User = {
  id: string
  email: string
  tenantId: string
  role: string
  status: string
  tenant: {
    name: string
    companyCode: string
  }
}

type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  user: User | null
  setIsAuthenticated: (v: boolean) => void
  setUser: (u: User | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me")
      setUser(res.data)
      setIsAuthenticated(true)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      await refreshUser()
      setLoading(false)
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setIsAuthenticated, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("AuthContext missing")
  return ctx
}