const express = require('express');

const router = express.Router();

const userConroller = require("../controllers/userController");


router.post("/user-create", userConroller.createUser);
router.post("/user-login", userConroller.loginUser);







module.exports = router;