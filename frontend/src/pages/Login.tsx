import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    await api.post("/auth/login", {
      email,
      password
    })

    setIsAuthenticated(true)
    navigate("/dashboard")
  }

  return (

    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-80"
      >

        <h1 className="text-xl mb-4">Login</h1>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full p-2"
        >
          Login
        </button>

      </form>

    </div>
  )
}