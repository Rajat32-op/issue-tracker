const prisma = require("../prisma")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// Admin registers a new company
exports.register = async (req, res) => {
  try {
    const { companyName, email, password } = req.body

    const hashed = await bcrypt.hash(password, 10)
    const companyCode = crypto.randomBytes(4).toString("hex").toUpperCase()

    const tenant = await prisma.tenant.create({
      data: {
        name: companyName,
        companyCode
      }
    })

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        tenantId: tenant.id,
        role: "ADMIN",
        status: "APPROVED"
      }
    })

    res.json({ message: "Company created", companyCode })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message })
  }
}

// User requests to join a company
exports.joinRequest = async (req, res) => {
  try {
    const { companyCode, email, password } = req.body

    const tenant = await prisma.tenant.findUnique({
      where: { companyCode }
    })

    if (!tenant) return res.status(404).json({ error: "Invalid company code" })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: "Email already registered" })

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        tenantId: tenant.id,
        role: "MEMBER",
        status: "PENDING"
      }
    })

    res.json({ message: "Join request sent. Wait for admin approval." })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) return res.status(401).json({ error: "Invalid email" })

    if (user.status === "PENDING") {
      return res.status(403).json({ error: "Your account is pending admin approval" })
    }

    if (user.status === "REJECTED") {
      return res.status(403).json({ error: "Your join request was rejected" })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: "Invalid password" })

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json({ message: "Logged in" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        tenantId: true,
        role: true,
        status: true,
        tenant: {
          select: {
            name: true,
            companyCode: true
          }
        }
      }
    })

    if (!user) return res.status(404).json({ error: "User not found" })

    res.json(user)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true
  })

  res.json({ message: "Logged out" })
}