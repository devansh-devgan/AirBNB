const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


router.route("/signup")
.get(userController.signupPage)//SignUp Page
.post(wrapAsync(userController.signupRequest))//SignUp Request

router.route("/login")
.get(userController.loginPage)//Login Page
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.loginRequest)//Login Request

//Logout
router.get("/logout", userController.logout);

module.exports = router;