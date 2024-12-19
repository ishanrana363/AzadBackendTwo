const express = require('express');

const router = express.Router();

const userConroller = require("../controllers/userController");
const { isLogIn } = require('../middlewares/authMiddleware');


router.post("/user-create", userConroller.createUser);
router.post("/user-login", userConroller.loginUser);
router.get("/user-profile", isLogIn ,userConroller.userProfile);
router.put("/user-profile-update", isLogIn , userConroller.updateProfile);
router.delete("/user-delete", isLogIn , userConroller.deleteUser)







module.exports = router;