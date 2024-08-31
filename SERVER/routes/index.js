const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/dept-list", adminController.deptList);
router.post("/dept-create", adminController.deptCreate);
router.get("/dept-details/:id", adminController.deptDetails);
router.patch("/dept-update/:id", adminController.deptUpdate);
router.delete("/dept-delete/:id", adminController.deptDelete);

router.get("/subject-list", adminController.subjectList);
router.post("/subject-create", adminController.subjectCreate);
router.get("/subject-details/:id", adminController.subjectDetails);
router.patch("/subject-update/:id", adminController.subjectUpdate);
router.delete("/subject-delete/:id", adminController.subjectDelete);


module.exports = router;
