import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import IssueList from "../components/IssueList"
import CreateIssue from "../components/CreateIssue"
import { Zap, LogOut, Bug, CheckCircle2, Clock, AlertCircle, BarChart3, Shield } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const StatCard = ({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl p-4 flex items-center gap-4 border"
    style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(12px)",
      borderColor: "rgba(255,255,255,0.08)",
    }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
    </div>
  </motion.div>
)

export default function Dashboard() {
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { setIsAuthenticated, setUser, user } = useAuth()
  const navigate = useNavigate()

  const fetchIssues = async () => {
    try {
      const res = await api.get("/issues")
      setIssues(res.data)
    } catch (err) {
      console.error("Failed to fetch issues", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {}
    setIsAuthenticated(false)
    setUser(null)
    navigate("/login")
  }

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === "OPEN").length,
    inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
    done: issues.filter((i) => i.status === "DONE").length,
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f172a 100%)" }}
    >
      {/* Background orbs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{ width: 600, height: 600, background: "rgba(124,58,237,0.3)", top: "-200px", right: "-100px" }}
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{ width: 500, height: 500, background: "rgba(59,130,246,0.2)", bottom: "-100px", left: "-100px" }}
          animate={{ x: [0, 70, 0], y: [0, -60, 0] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navbar */}
      <div
        className="z-10 sticky top-0"
        style={{
          background: "rgba(15,12,41,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Issue Tracker</span>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "ADMIN" && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-white/50 hover:text-white/90 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/6"
              >
                <Shield size={15} />
                Admin
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/50 hover:text-white/90 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/6"
            >
              <LogOut size={15} />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <Bug className="text-violet-400" size={22} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          </div>
          <p className="text-white/35 text-sm ml-8">Track and manage your team's issues</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 size={18} className="text-violet-300" />}
            label="Total"
            value={stats.total}
            color="bg-violet-500/20"
            delay={0.05}
          />
          <StatCard
            icon={<AlertCircle size={18} className="text-sky-300" />}
            label="Open"
            value={stats.open}
            color="bg-sky-500/20"
            delay={0.1}
          />
          <StatCard
            icon={<Clock size={18} className="text-amber-300" />}
            label="In Progress"
            value={stats.inProgress}
            color="bg-amber-500/20"
            delay={0.15}
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-emerald-300" />}
            label="Done"
            value={stats.done}
            color="bg-emerald-500/20"
            delay={0.2}
          />
        </div>

        <CreateIssue refresh={fetchIssues} />
        <IssueList issues={issues} loading={loading} refresh={fetchIssues} />
      </div>
    </div>
  )
}