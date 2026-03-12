const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {

  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded // { userId, tenantId, role }

    next()

  } catch {
    res.status(401).json({ error: "Invalid token" })
  }

}