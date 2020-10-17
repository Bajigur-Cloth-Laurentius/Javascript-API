"use strict"

const router = require("express").Router()
const admin = require("./admin")
const member = require("./member")
const productManagement = require("./productManagement")

router.use("/admin", admin)
router.use("/member", member)
router.use("/product", productManagement)

module.exports = router