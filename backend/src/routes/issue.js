const router = require("express").Router()
const issue = require("../controllers/issue.js")
const auth = require("../middlewears/auth.js")

router.get("/", auth, issue.getIssues)
router.post("/", auth, issue.createIssue)

module.exports = router