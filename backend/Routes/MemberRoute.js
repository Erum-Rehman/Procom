const express = require("express");
const { createMember, getMembers } = require("../Controller/MemberController");
const { protect } = require("../Controller/AuthController");

const router = express.Router();

router.route("/createMember/:M_id").post(protect, createMember);
router.route("/getMembers").get(protect, getMembers);

module.exports = router;
