const prisma = require("../prisma")

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        tenantId: req.user.tenantId,
        status: "PENDING"
      },
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    })

    res.json(users)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findFirst({
      where: {
        id,
        tenantId: req.user.tenantId,
        status: "PENDING"
      }
    })

    if (!user) return res.status(404).json({ error: "Request not found" })

    await prisma.user.update({
      where: { id },
      data: { status: "APPROVED" }
    })

    res.json({ message: "User approved" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findFirst({
      where: {
        id,
        tenantId: req.user.tenantId,
        status: "PENDING"
      }
    })

    if (!user) return res.status(404).json({ error: "Request not found" })

    await prisma.user.update({
      where: { id },
      data: { status: "REJECTED" }
    })

    res.json({ message: "User rejected" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getTeamMembers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        tenantId: req.user.tenantId,
        status: "APPROVED"
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "asc" }
    })

    res.json(users)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
