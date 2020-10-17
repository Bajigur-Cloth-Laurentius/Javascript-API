"use strict"

const router = require("express").Router()
const ProductControllers = require("../controllers/productControllers")
const Auth = require("../middlewares/auth")
const multer = require("multer")
const upload = multer()

router.post("/bulk", upload.single("products"), Auth.adminAuthenticate, Auth.adminIsSuperAdmin, ProductControllers.productBulkInsert)
router.get("/detail/:productDetailId", ProductControllers.productGet)
router.put("/detail/:productDetailId", Auth.adminAuthenticate, Auth.adminIsSuperAdmin, ProductControllers.productDetailUpdate)
router.patch("/detail/:productDetailId", Auth.adminAuthenticate, ProductControllers.productDetailStockPatch)
router.delete("/detail/:productDetailId", Auth.adminAuthenticate, Auth.adminIsSuperAdmin, ProductControllers.productDetailDelete)
router.put("/:productId", Auth.adminAuthenticate, Auth.adminIsSuperAdmin, ProductControllers.productDelete)
router.delete("/:productId", Auth.adminAuthenticate, Auth.adminIsSuperAdmin, ProductControllers.productInsert)
router.get("/", ProductControllers.productGetAll)
router.post("/", Auth.adminAuthenticate, Auth.adminIsSuperAdmin, ProductControllers.productInsert)

module.exports = router