const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const teacherController = require ("../controllers/teacherController")

router.post("/user-create", userController.userCreate);
router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);

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
router.post("/subject-create", adminController.subjectCreate);
router.get("/subject-details/:id", adminController.subjectDetails);
router.patch("/subject-update/:id", adminController.subjectUpdate);
router.delete("/subject-delete/:id", adminController.subjectDelete);


router.post("/teacher-feedback", teacherController.teacherFeedback);


module.exports = router;
