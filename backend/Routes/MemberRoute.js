const express = require("express");
const { getAllUsers } = require("../Controller/UserController");

const router = express.Router();

router.route("/allUsers").get(getAllUsers);

module.exports = router;
