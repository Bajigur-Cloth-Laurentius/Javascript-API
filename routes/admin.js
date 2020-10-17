"use strict"

const router = require("express").Router()
const LoginControllers = require("../controllers/loginControllers")
const AdminControllers = require("../controllers/adminControllers")
const MemberControllers = require("../controllers/memberControllers")
const RecommendationControllers = require("../controllers/recommendationControllers")
const Auth = require("../middlewares/auth")
const multer = require("multer")
const upload = multer()

router.post("/login", LoginControllers.adminLogin)
router.post("/register/history", upload.single("history"), Auth.adminAuthenticate, Auth.adminModifyAuthorize, RecommendationControllers.historyBulkRegister)
router.post("/register/members", upload.single("members"), Auth.adminAuthenticate, Auth.adminModifyAuthorize, MemberControllers.memberBulkRegister)
router.post("/register/admins", upload.single("admins"), Auth.adminAuthenticate, Auth.adminModifyAuthorize, AdminControllers.adminBulkRegister)
router.post("/register", AdminControllers.adminRegister)
router.get("/:adminId", Auth.adminAuthenticate, AdminControllers.adminGet)
router.put("/:adminId", Auth.adminAuthenticate, Auth.adminModifyAuthorize, AdminControllers.adminUpdate)
router.delete("/:adminId", Auth.adminAuthenticate, Auth.adminModifyAuthorize, AdminControllers.adminRemove)
router.get("/", Auth.adminAuthenticate, Auth.adminModifyAuthorize, AdminControllers.adminGetAll)

module.exports = router