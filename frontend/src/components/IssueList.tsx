import api from "../api/axios"

export default function IssueList({ issues, refresh }: any) {
    const deleteIssue = async (id: string) => {
        await api.delete(`/issues/${id}`)
        refresh()
    }

    return (

        <div className="mt-6 space-y-4">

            {issues.map((issue: any) => (

                <div
                    key={issue.id}
                    className="border p-4 rounded"
                >

                    <h2 className="font-semibold">
                        {issue.title}
                    </h2>

                    <p className="text-sm text-gray-600">
                        {issue.description}
                    </p>

                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {issue.status}
                    </span>
                    <button
                        onClick={() => deleteIssue(issue.id)}
                        className="text-red-500 text-sm"
                    >
                        Delete
                    </button>
                    <select
                        value={issue.status}
                        onChange={async (e) => {
                            await api.patch(`/issues/${issue.id}`, {
                                status: e.target.value
                            })
                            refresh()
                        }}
                    >
                        <option>OPEN</option>
                        <option>IN_PROGRESS</option>
                        <option>DONE</option>
                    </select>
                </div>

            ))}

        </div>

    )
}