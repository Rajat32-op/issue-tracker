const prisma = require("../prisma")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const { companyName, email, password } = req.body

    const hashed = await bcrypt.hash(password, 10)

    const tenant = await prisma.tenant.create({
      data: {
        name: companyName
      }
    })

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        tenantId: tenant.id
      }
    })

    res.json({ message: "Tenant + user created" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {

  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) return res.status(401).json({ error: "Invalid email" })

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.status(401).json({ error: "Invalid password" })

  const token = jwt.sign(
    {
      userId: user.id,
      tenantId: user.tenantId
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  )

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // true in production
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  })

  res.json({ message: "Logged in" })
}

exports.me = async (req, res) => {

  try {

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        tenantId: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }

}