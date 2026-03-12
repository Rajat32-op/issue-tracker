const router = require("express").Router()
const admin = require("../controllers/admin.js")
const auth = require("../middlewears/auth.js")
const adminOnly = require("../middlewears/admin.js")

router.get("/pending", auth, adminOnly, admin.getPendingUsers)
router.patch("/approve/:id", auth, adminOnly, admin.approveUser)
router.patch("/reject/:id", auth, adminOnly, admin.rejectUser)
router.get("/team", auth, adminOnly, admin.getTeamMembers)

module.exports = router
