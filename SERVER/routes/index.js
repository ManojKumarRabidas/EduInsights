const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/dept-list", adminController.deptList);
router.post("/dept-create", adminController.deptCreate);
router.get("/dept-details/:id", adminController.deptDetails);
router.patch("/dept-update/:id", adminController.deptUpdate);
router.delete("/dept-delete/:id", adminController.deptDelete);

module.exports = router;
