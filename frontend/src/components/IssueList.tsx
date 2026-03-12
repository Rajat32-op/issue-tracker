import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertCircle, Clock, CheckCircle2, Inbox, Loader2 } from "lucide-react"
import api from "../api/axios"

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; badge: string; borderColor: string }> = {
  OPEN: {
    label: "Open",
    icon: <AlertCircle size={12} />,
    badge: "bg-sky-500/15 text-sky-300 border border-sky-500/25",
    borderColor: "#0ea5e9",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: <Clock size={12} />,
    badge: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    borderColor: "#f59e0b",
  },
  DONE: {
    label: "Done",
    icon: <CheckCircle2 size={12} />,
    badge: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    borderColor: "#10b981",
  },
}

export default function IssueList({ issues, loading, refresh }: any) {
  const deleteIssue = async (id: string) => {
    await api.delete(`/issues/${id}`)
    refresh()
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <Loader2 size={28} className="text-violet-400 animate-spin mb-3" />
        <p className="text-white/25 text-sm">Loading issues...</p>
      </motion.div>
    )
  }

  if (issues.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="flex flex-col items-center justify-center py-20 rounded-2xl border"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <Inbox size={40} className="text-white/15 mb-3" />
        <p className="text-white/25 text-sm font-medium">No issues yet</p>
        <p className="text-white/15 text-xs mt-1">Create your first issue above</p>
      </motion.div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {issues.map((issue: any, index: number) => {
          const cfg = STATUS_CONFIG[issue.status] ?? STATUS_CONFIG.OPEN

          return (
            <motion.div
              key={issue.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{ y: -3, transition: { duration: 0.2, delay: 0 } }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid rgba(255,255,255,0.09)`,
                borderLeft: `4px solid ${cfg.borderColor}`,
                boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              }}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-white text-sm leading-snug truncate">
                      {issue.title}
                    </h2>
                    {issue.description && (
                      <p className="text-white/40 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteIssue(issue.id)}
                    className="text-white/20 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3">
                  <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>

                  <select
                    value={issue.status}
                    onChange={async (e) => {
                      await api.patch(`/issues/${issue.id}`, { status: e.target.value })
                      refresh()
                    }}
                    className="text-xs rounded-lg px-2.5 py-1.5 text-white/70 outline-none cursor-pointer transition-all focus:ring-2 focus:ring-violet-500/40 hover:text-white"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}