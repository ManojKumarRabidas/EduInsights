const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/createuser", userController.createUser);
router.get("/userlist", userController.getAllUsers);
router.get("/userdetails/:id", userController.getUser);
router.delete("/deleteuser/:id", userController.deleteUser);
router.patch("/updateuser/:id", userController.updateUser);

module.exports = router;
