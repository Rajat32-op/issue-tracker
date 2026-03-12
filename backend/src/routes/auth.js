const router = require("express").Router()
const auth = require("../controllers/auth.js")
const authMiddleware=require("../middlewears/auth.js")

router.post("/register", auth.register)
router.post("/login", auth.login)
router.get("/me",authMiddleware,auth.me)
router.post("/logout",auth.logout)

module.exports = router