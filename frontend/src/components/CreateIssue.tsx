import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, ChevronDown, Loader2 } from "lucide-react"
import api from "../api/axios"

export default function CreateIssue({ refresh }: any) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await api.post("/issues", { title, description })
      setTitle("")
      setDescription("")
      refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="rounded-2xl mb-6 border overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <PlusCircle size={18} className="text-violet-400" />
          <span className="text-white font-semibold text-sm">New Issue</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} className="text-white/40" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <form onSubmit={handleCreate} className="px-6 pb-6 space-y-3">
              <div
                className="h-px w-full mb-4"
                style={{ background: "rgba(255,255,255,0.07)" }}
              />

              <input
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-violet-500/40"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                placeholder="Issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-white/25 outline-none transition-all focus:ring-2 focus:ring-violet-500/40 resize-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                placeholder="Describe the issue (optional)"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={loading || !title.trim()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
                  }}
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <PlusCircle size={15} />
                  )}
                  Create Issue
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}