const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth.js")
const issueRoutes = require("./routes/issue.js")
const adminRoutes = require("./routes/admin.js")

const app = express()
const allowedOrigins= ["http://localhost:5173","https://merry-cassata-439a0d.netlify.app"]
app.use(cors({
  origin:allowedOrigins,
  credentials: true
}))


app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/issues", issueRoutes)
app.use("/admin", adminRoutes)

app.listen(5000, () => {
  console.log("server running")
})