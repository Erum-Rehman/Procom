const express = require("express");
const { getAllUsers } = require("../Controller/UserController");
const { protect } = require("../Controller/AuthController");

const router = express.Router();

router.route("/users").get(protect, getAllUsers);

module.exports = router;