const prisma = require("../prisma")

exports.getIssues = async (req, res) => {

  const issues = await prisma.issue.findMany({
    where: {
      tenantId: req.user.tenantId
    }
  })

  res.json(issues)
}

exports.createIssue = async (req, res) => {

  const { title, description } = req.body

  const issue = await prisma.issue.create({
    data: {
      title,
      description,
      status: "OPEN",
      tenantId: req.user.tenantId,
      createdBy: req.user.userId
    }
  })

  res.json(issue)
}

exports.updateIssue = async (req, res) => {

  const { id } = req.params
  const { title, description, status } = req.body

  try {

    const issue = await prisma.issue.updateMany({
      where: {
        id: id,
        tenantId: req.user.tenantId
      },
      data: {
        title,
        description,
        status
      }
    })

    if (issue.count === 0) {
      return res.status(404).json({ error: "Issue not found" })
    }

    res.json({ message: "Issue updated" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

}

exports.deleteIssue = async (req, res) => {

  const { id } = req.params

  const result = await prisma.issue.deleteMany({
    where: {
      id: id,
      tenantId: req.user.tenantId
    }
  })

  if (result.count === 0) {
    return res.status(404).json({ error: "Issue not found" })
  }

  res.json({ message: "Issue deleted" })

}