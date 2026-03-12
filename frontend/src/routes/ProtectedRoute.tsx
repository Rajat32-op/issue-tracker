import { Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import type { JSX } from "react/jsx-dev-runtime"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f172a 100%)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 size={32} className="text-violet-400 animate-spin" />
          <span className="text-white/30 text-sm font-medium">Loading...</span>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}

export default ProtectedRoute