"use strict"

const router = require("express").Router()
const LoginControllers = require("../controllers/loginControllers")
const MemberControllers = require("../controllers/memberControllers")
const RecommendationControllers = require("../controllers/recommendationControllers")
const Auth = require("../middlewares/auth")

router.post("/login", LoginControllers.memberLogin)
router.get("/recommendation", Auth.memberAuthenticate, RecommendationControllers.getRecommendation)
router.post("/register", MemberControllers.memberRegister)
router.get("/:memberId", Auth.memberAuthenticate, MemberControllers.memberGet)
router.put("/:memberId", Auth.memberAuthenticate, Auth.memberModifyAuthorize, MemberControllers.memberUpdate)
router.delete("/:memberId", Auth.memberAuthenticate, Auth.memberModifyAuthorize, MemberControllers.memberRemove)
router.get("/", Auth.adminAuthenticate, Auth.adminModifyAuthorize, MemberControllers.memberGetAll)

module.exports = router