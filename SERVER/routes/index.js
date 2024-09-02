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


router.get("/subject-list", adminController.subjectList);
router.get("/get-departments", adminController.getDepartments);
router.post("/subject-create", adminController.subjectCreate);
router.get("/subject-details/:id", adminController.subjectDetails);
router.patch("/subject-update/:id", adminController.subjectUpdate);
router.delete("/subject-delete/:id", adminController.subjectDelete);


router.get("/improve-list", adminController.improveList);
router.post("/improve-create", adminController.improveCreate);
router.get("/improve-details/:id", adminController.improveDetails);
router.patch("/improve-update/:id", adminController.improveUpdate);
router.delete("/improve-delete/:id", adminController.improveDelete);
router.put("/improve-update-active/:id", adminController.improveUpdateActive);


module.exports = router;
