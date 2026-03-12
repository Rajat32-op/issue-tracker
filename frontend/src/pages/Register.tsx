import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Building2, Hash, Zap, ArrowRight, Loader2, CheckCircle2, Users } from "lucide-react"
import api from "../api/axios"
import { useNavigate, Link } from "react-router-dom"

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

const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
}

const inputClass =
  "w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all focus:ring-2 focus:ring-violet-500/40 placeholder-white/25"

export default function Register() {
  const [tab, setTab] = useState<"company" | "join">("company")

  // Company registration
  const [companyName, setCompanyName] = useState("")
  const [compEmail, setCompEmail] = useState("")
  const [compPassword, setCompPassword] = useState("")

  // Join company
  const [joinCode, setJoinCode] = useState("")
  const [joinEmail, setJoinEmail] = useState("")
  const [joinPassword, setJoinPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const res = await api.post("/auth/register", {
        companyName,
        email: compEmail,
        password: compPassword,
      })
      setSuccess(`Company created! Your code: ${res.data.companyCode}`)
      setTimeout(() => navigate("/login"), 3000)
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await api.post("/auth/join-request", {
        companyCode: joinCode,
        email: joinEmail,
        password: joinPassword,
      })
      setSuccess("Request sent! Wait for admin approval, then log in.")
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send request.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0d1b3e 100%)" }}
    >
      <Orb
        style={{ width: 450, height: 450, background: "rgba(79,70,229,0.22)", top: "-120px", right: "-80px" }}
        animate={{ x: [0, -70, 0], y: [0, 80, 0] }}
      />
      <Orb
        style={{ width: 380, height: 380, background: "rgba(124,58,237,0.2)", bottom: "-80px", left: "-100px" }}
        animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
      />
      <Orb
        style={{ width: 250, height: 250, background: "rgba(59,130,246,0.15)", top: "35%", left: "20%" }}
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
      />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

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
          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
            {[
              { id: "company" as const, label: "Register Company", icon: <Building2 size={14} /> },
              { id: "join" as const, label: "Join Company", icon: <Users size={14} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id)
                  setError("")
                  setSuccess("")
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === t.id
                    ? "text-white shadow-md"
                    : "text-white/35 hover:text-white/60"
                }`}
                style={tab === t.id ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" } : {}}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "company" ? (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col items-center mb-6">
                  <Building2 className="text-violet-400 mb-2" size={28} />
                  <h1 className="text-xl font-bold text-white tracking-tight">Create workspace</h1>
                  <p className="text-white/40 text-xs mt-1">Register your company & become admin</p>
                </div>

                <form onSubmit={handleRegisterCompany} className="space-y-3">
                  <div className="relative group">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors" size={16} />
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors" size={16} />
                    <input
                      type="email"
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Admin email"
                      value={compEmail}
                      onChange={(e) => setCompEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors" size={16} />
                    <input
                      type="password"
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Password"
                      value={compPassword}
                      onChange={(e) => setCompPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center">
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 justify-center text-emerald-400 text-xs text-center"
                    >
                      <CheckCircle2 size={14} />
                      {success}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-1 shadow-lg"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={16} /> Create Company</>}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="join"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col items-center mb-6">
                  <Users className="text-sky-400 mb-2" size={28} />
                  <h1 className="text-xl font-bold text-white tracking-tight">Join a team</h1>
                  <p className="text-white/40 text-xs mt-1">Enter the code shared by your admin</p>
                </div>

                <form onSubmit={handleJoinCompany} className="space-y-3">
                  <div className="relative group">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sky-400 transition-colors" size={16} />
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Company code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sky-400 transition-colors" size={16} />
                    <input
                      type="email"
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Your email"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-sky-400 transition-colors" size={16} />
                    <input
                      type="password"
                      className={inputClass}
                      style={inputStyle}
                      placeholder="Create password"
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center">
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 justify-center text-emerald-400 text-xs text-center"
                    >
                      <CheckCircle2 size={14} />
                      {success}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all mt-1 shadow-lg"
                    style={{ background: "linear-gradient(135deg, #0ea5e9, #4f46e5)", boxShadow: "0 8px 24px rgba(14,165,233,0.3)" }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={16} /> Send Request</>}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-white/35 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <Zap size={13} className="text-white/20" />
          <span className="text-white/20 text-xs font-medium tracking-widest uppercase">Issue Tracker</span>
        </div>
      </motion.div>
    </div>
  )
}