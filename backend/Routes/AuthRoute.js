const express = require("express");
const {
    userSignUp,
    login,
    forgotPassword,
    resetPassword,
    protect,
    updatePassword,
    logout,
  } = require("../Controller/AuthController");

const router = express.Router();


router.route("/signup").post(userSignUp);
router.route("/login").post(login);
router.route("/forgotpasswaord").post(forgotPassword);
router.route("/resetpassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(protect,updatePassword)
router.route("/logout").get(logout)

module.exports = router;
