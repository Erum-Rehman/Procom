const express = require("express");
const { createBoard } = require("../Controller/BoardController");

const { protect } = require("../Controller/AuthController");

const router = express.Router();

router.route("/newBoard").post(protect, createBoard);
// router.route("/login").post(login);
// router.route("/forgotpasswaord").post(forgotPassword);
// router.route("/resetpassword/:token").patch(resetPassword);
// router.route("/updatePassword").patch(protect, updatePassword);
// router.route("/logout").get(logout);

module.exports = router;
