import { useState } from "react"
import api from "../api/axios"

export default function CreateIssue({ refresh }: any) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    await api.post("/issues", {
      title,
      description
    })

    setTitle("")
    setDescription("")

    refresh()
  }

  return (

    <form
      onSubmit={handleCreate}
      className="mb-6 border p-4 rounded"
    >

      <h2 className="font-semibold mb-3">
        Create Issue
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Create
      </button>

    </form>
  )
}