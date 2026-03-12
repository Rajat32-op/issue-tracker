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