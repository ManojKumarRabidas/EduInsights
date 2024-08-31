const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


router.get("/dept-list", adminController.deptList);
router.post("/dept-create", adminController.deptCreate);
router.get("/dept-details/:id", adminController.deptDetails);
router.patch("/dept-update/:id", adminController.deptUpdate);
router.delete("/dept-delete/:id", adminController.deptDelete);
router.put("/dept-update-active/:id", adminController.deptUpdateActive);

router.get("/strength-list", adminController.strengthList);
router.post("/strength-create", adminController.strengthCreate);
router.get("/strength-details/:id", adminController.strengthDetails);
router.patch("/strength-update/:id", adminController.strengthUpdate);
router.delete("/strength-delete/:id", adminController.strengthDelete);

module.exports = router;
