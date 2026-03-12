const router = require("express").Router()
const issue = require("../controllers/issue.controller")
const auth = require("../middleware/auth.middleware")

router.get("/", auth, issue.getIssues)
router.post("/", auth, issue.createIssue)

module.exports = router