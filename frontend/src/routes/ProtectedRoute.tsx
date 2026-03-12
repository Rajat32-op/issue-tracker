import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { JSX } from "react/jsx-dev-runtime"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}

export default ProtectedRoute