import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Zap, ArrowRight, Loader2 } from "lucide-react"
import api from "../api/axios"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Orb = ({
  style,
  animate,
}: {
  style: React.CSSProperties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animate: any
}) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={style}
    animate={animate}
    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
  />
)

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { setIsAuthenticated, refreshUser } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.post("/auth/login", { email, password })
      await refreshUser()
      setIsAuthenticated(true)
      navigate("/")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}
    >
      {/* Animated background orbs */}
      <Orb
        style={{ width: 500, height: 500, background: "rgba(124,58,237,0.25)", top: "-150px", left: "-150px" }}
        animate={{ x: [0, 70, 0], y: [0, 90, 0] }}
      />
      <Orb
        style={{ width: 400, height: 400, background: "rgba(79,70,229,0.2)", bottom: "-100px", right: "-100px" }}
        animate={{ x: [0, -80, 0], y: [0, -70, 0] }}
      />
      <Orb
        style={{ width: 300, height: 300, background: "rgba(168,85,247,0.18)", top: "40%", right: "15%" }}
        animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div
          className="rounded-3xl p-8 border"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              <Zap className="text-white" size={26} fill="white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-white/40 text-sm mt-1">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative group">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors"
                size={16}
              />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/40"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors"
                size={16}
              />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/40"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-2 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/35 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}