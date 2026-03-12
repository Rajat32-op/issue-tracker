import { useEffect, useState } from "react"
import api from "../api/axios"
import IssueList from "../components/IssueList"
import CreateIssue from "../components/CreateIssue"

export default function Dashboard() {

  const [issues, setIssues] = useState<any[]>([])

  const fetchIssues = async () => {
    const res = await api.get("/issues")
    setIssues(res.data)
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Issue Dashboard
      </h1>

      <CreateIssue refresh={fetchIssues} />

      <IssueList issues={issues} refresh={fetchIssues} />

    </div>

  )
}