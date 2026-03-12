import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

export default function Register() {

  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    await api.post("/auth/register", {
      companyName,
      email,
      password
    })

    navigate("/login")
  }

  return (

    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow w-80"
      >

        <h1 className="text-xl mb-4">Register Company</h1>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Company Name"
          onChange={(e) => setCompanyName(e.target.value)}
        />

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

        <button className="bg-green-500 text-white w-full p-2">
          Register
        </button>

      </form>

    </div>
  )
}