const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth.js")
const issueRoutes = require("./routes/issue.js")

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/issues", issueRoutes)

app.listen(5000, () => {
  console.log("server running")
})