const express = require("express");
const {
  createBoard,
  getAllBorads,
  getBoardDetails,
  DeleteBoard,
} = require("../Controller/BoardController");

const { protect } = require("../Controller/AuthController");

const router = express.Router();

router.route("/newBoard").post(protect, createBoard);
router.route("/boards").get(protect, getAllBorads);
router.route("/boardDetails/:id").get(protect, getBoardDetails);
router.route("/boardDelete/:id").delete(protect, DeleteBoard);

module.exports = router;
