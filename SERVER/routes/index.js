const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const teacherController = require ("../controllers/teacherController");
const studentController = require ("../controllers/studentController");
const utilController = require ("../controllers/utilController");
const { authorizeRole } = require('../middleware/authMiddleware');

  
router.post("/user-create", userController.userCreate);
router.get("/check-login-id/:login_id", userController.userCheckLoginIdAvailability);
router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.get("/auth/user", userController.getUser);

router.get("/user-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.userList);
router.put("/user-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.userUpdateActive);

router.post("/change-password", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), userController.changePassword);
router.post("/forgot-password-send-otp", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), utilController.forgotPasswordSendOtp);
router.post("/forgot-password-check-otp", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), utilController.forgotPasswordCheckOtp);
router.post("/forgot-password-change-password", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), utilController.forgotPasswordChangePassword);

router.get("/get-profile-details",authorizeRole(['SUPPORT', 'TEACHER', 'STUDENT']), userController.profileDetails);

router.get("/pending-verification-user-list", adminController.userPendingVerificationList);
router.put("/user-update-verificaton/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.userUpdateVerificationStatus);

router.get("/support-user-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.supportUserList);
router.post("/support-user-create", authorizeRole(['ADMIN', 'SUPPORT']), adminController.supportUserCreate);
router.get("/support-user-details/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.supportUserDetails);
router.patch("/support-user-update/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.supportUserUpdate);
router.delete("/support-user-delete/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.supportUserDelete);
router.put("/support-user-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.supportUserUpdateActive);

router.get("/dept-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.deptList);
router.post("/dept-create",authorizeRole(['ADMIN', 'SUPPORT']), adminController.deptCreate);
router.get("/dept-details/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.deptDetails);
router.patch("/dept-update/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.deptUpdate);
router.delete("/dept-delete/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.deptDelete);
router.put("/dept-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.deptUpdateActive);

router.get("/strength-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.strengthList);
router.post("/strength-create", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), adminController.strengthCreate);
router.get("/strength-details/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.strengthDetails);
router.patch("/strength-update/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.strengthUpdate);
router.delete("/strength-delete/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.strengthDelete);
router.put("/strength-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.strengthUpdateActive);

router.get("/subject-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.subjectList);
router.get("/get-departments", adminController.getDepartments);

router.post("/subject-create", authorizeRole(['ADMIN', 'SUPPORT']), adminController.subjectCreate);
router.get("/subject-details/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.subjectDetails);
router.patch("/subject-update/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.subjectUpdate);
router.delete("/subject-delete/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.subjectDelete);
router.put("/subject-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.subjectUpdateActive);

router.get("/area-of-improvement-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.areaOfImprovementList);
router.post("/area-of-improvement-create", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), adminController.areaOfImprovementCreate);
router.get("/area-of-improvement-details/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.areaOfImprovementDetails);
router.patch("/area-of-improvement-update/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.areaOfImprovementUpdate);
router.delete("/area-of-improvement-delete/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.areaOfImprovementDelete);
router.put("/area-of-improvement-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.areaOfImprovementUpdateActive);

router.get("/session-list", authorizeRole(['ADMIN', 'SUPPORT']), adminController.sessionList);
router.post("/session-create", authorizeRole(['ADMIN', 'SUPPORT', 'TEACHER', 'STUDENT']), adminController.sessionCreate);
router.get("/session-details/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.sessionDetails);
router.patch("/session-update/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.sessionUpdate);
router.delete("/session-delete/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.sessionDelete);
router.put("/session-update-active/:id", authorizeRole(['ADMIN', 'SUPPORT']), adminController.sessionUpdateActive);

//--------------------------Teacher Profile---------------------------------------
router.post("/teacher-feedback",authorizeRole(['TEACHER']), teacherController.teacherFeedback);
// router.patch("/students-feedback-list", teacherController.studentsFeedbackList);
router.patch("/students-feedback-list",authorizeRole(['TEACHER', 'ADMIN', 'SUPPORT']),  teacherController.studentsFeedbackList);


// router.get("/get-departments", adminController.getDepartments);
router.patch("/get-semester-of-rating", adminController.getSemisterOfRating);
router.patch("/get-conditional-subjects", adminController.getSubjects);

router.patch("/get-student-names", adminController.getStudentNames);

router.get("/get-strength-name", studentController.getStrengthName);
router.get("/get-improvement-area", studentController.getImprovementArea);

router.get("/get-subject-name" , teacherController.getSubjectNames);
//---------------------------Student Profile--------------------------------------
router.post("/student-feedback",authorizeRole(['STUDENT']), studentController.studentFeedback);
router.patch("/teachers-feedback-list",authorizeRole(['STUDENT', 'ADMIN', 'SUPPORT']),  studentController.teachersFeedbackList);

router.get("/get-teacher-code", studentController.getTeachersCode);

router.get("/get-conditional-subjects-code",authorizeRole(['STUDENT']), studentController.getSubjectsCode);

router.get("/get-student-area-of-improvement",teacherController.getAreaForImprovement);
router.get("/get-student-strength",teacherController.getStudentStrenghts );

// Dashboard 
router.patch("/get-conditional-user-list",authorizeRole(['TEACHER', 'STUDENT', 'ADMIN', 'SUPPORT']), utilController.getConditionalUserList)
router.patch("/get-user-feedback-details",authorizeRole(['TEACHER', 'STUDENT', 'ADMIN', 'SUPPORT']), utilController.getUserFeedbackDetails)
router.get("/get-top-growths",authorizeRole(['ADMIN', 'SUPPORT']), utilController.getTopGrowths)
router.patch("/get-custom-range-user-feedback-details",authorizeRole(['TEACHER', 'STUDENT', 'ADMIN', 'SUPPORT']), utilController.getCustomMonthFeedbackDetails)

module.exports = router;