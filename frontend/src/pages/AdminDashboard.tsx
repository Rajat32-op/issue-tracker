import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import {
  Zap, LogOut, Shield, Copy, Check, UserPlus,
  Users, CheckCircle2, XCircle, Clock, Mail, Bug
} from "lucide-react"

type PendingUser = {
  id: string
  email: string
  status: string
  createdAt: string
}

type TeamMember = {
  id: string
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const [pending, setPending] = useState<PendingUser[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<"requests" | "team">("requests")

  const { user, setIsAuthenticated, setUser } = useAuth()
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [pendingRes, teamRes] = await Promise.all([
        api.get("/admin/pending"),
        api.get("/admin/team"),
      ])
      setPending(pendingRes.data)
      setTeam(teamRes.data)
    } catch (err) {
      console.error("Failed to fetch admin data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    try { await api.post("/auth/logout") } catch {}
    setIsAuthenticated(false)
    setUser(null)
    navigate("/login")
  }

  const handleApprove = async (id: string) => {
    await api.patch(`/admin/approve/${id}`)
    fetchData()
  }

  const handleReject = async (id: string) => {
    await api.patch(`/admin/reject/${id}`)
    fetchData()
  }

  const copyCode = () => {
    if (user?.tenant?.companyCode) {
      navigator.clipboard.writeText(user.tenant.companyCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0f172a 100%)" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
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
            <span className="text-xs text-violet-400 font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 ml-1">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/50 hover:text-white/90 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/6"
            >
              <Bug size={15} />
              Issues
            </motion.button>
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
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <Shield className="text-violet-400" size={22} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-white/35 text-sm ml-8">
            {user?.tenant?.name} — Manage team access
          </p>
        </motion.div>

        {/* Company Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 mb-6 border flex items-center justify-between"
          style={cardStyle}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <UserPlus size={18} className="text-violet-300" />
            </div>
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Company Invite Code</p>
              <p className="text-white text-lg font-mono font-bold tracking-widest mt-0.5">
                {user?.tenant?.companyCode || "—"}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyCode}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{
              background: copied ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.15)",
              color: copied ? "#34d399" : "#c4b5fd",
              border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(139,92,246,0.3)"}`,
            }}
          >
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Code</>}
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
          {[
            { id: "requests" as const, label: "Pending Requests", icon: <Clock size={14} />, count: pending.length },
            { id: "team" as const, label: "Team Members", icon: <Users size={14} />, count: team.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t.id ? "text-white shadow-md" : "text-white/35 hover:text-white/60"
              }`}
              style={tab === t.id ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" } : {}}
            >
              {t.icon}
              {t.label}
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: tab === t.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  color: tab === t.id ? "white" : "rgba(255,255,255,0.4)",
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === "requests" ? (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {loading ? (
                <div className="flex justify-center py-16">
                  <Clock size={24} className="text-violet-400 animate-spin" />
                </div>
              ) : pending.length === 0 ? (
                <div
                  className="flex flex-col items-center py-16 rounded-2xl border"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <CheckCircle2 size={36} className="text-white/15 mb-3" />
                  <p className="text-white/25 text-sm font-medium">No pending requests</p>
                  <p className="text-white/15 text-xs mt-1">Share your company code to invite members</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((u, i) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl p-4 flex items-center justify-between border"
                      style={cardStyle}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                          <Mail size={15} className="text-amber-300" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{u.email}</p>
                          <p className="text-white/30 text-xs mt-0.5">
                            Requested {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleApprove(u.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                          style={{
                            background: "rgba(16,185,129,0.12)",
                            color: "#34d399",
                            border: "1px solid rgba(16,185,129,0.25)"
                          }}
                        >
                          <CheckCircle2 size={13} />
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleReject(u.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                          style={{
                            background: "rgba(239,68,68,0.12)",
                            color: "#f87171",
                            border: "1px solid rgba(239,68,68,0.25)"
                          }}
                        >
                          <XCircle size={13} />
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {loading ? (
                <div className="flex justify-center py-16">
                  <Clock size={24} className="text-violet-400 animate-spin" />
                </div>
              ) : team.length === 0 ? (
                <div
                  className="flex flex-col items-center py-16 rounded-2xl border"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  <Users size={36} className="text-white/15 mb-3" />
                  <p className="text-white/25 text-sm font-medium">No team members yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {team.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl p-4 flex items-center justify-between border"
                      style={cardStyle}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                          <Mail size={15} className="text-indigo-300" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{m.email}</p>
                          <p className="text-white/30 text-xs mt-0.5">
                            Joined {new Date(m.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          m.role === "ADMIN"
                            ? "bg-violet-500/15 text-violet-300 border-violet-500/25"
                            : "bg-sky-500/15 text-sky-300 border-sky-500/25"
                        }`}
                      >
                        {m.role}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
