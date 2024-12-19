const express = require('express');

const router = express.Router();
// user controler
const userConroller = require("../controllers/userController");
const { isLogIn } = require('../middlewares/authMiddleware');
// forget password controller
const forgotPasswordController = require("../controllers/forgetPasswordController")


router.post("/user-create", userConroller.createUser);
router.post("/user-login", userConroller.loginUser);
router.get("/user-profile", isLogIn ,userConroller.userProfile);
router.put("/user-profile-update", isLogIn , userConroller.updateProfile);
router.delete("/user-delete", isLogIn , userConroller.deleteUser);

// forget password
router.post("/send-otp", forgotPasswordController.sendOtp );
router.post("/otp-verify", forgotPasswordController.verifyOtp);
router.post("/reset-password", forgotPasswordController.resetPassword);






module.exports = router;