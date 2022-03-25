const express = require("express");
const {
  createCard,
  updateCard,
  getAllCards,
  getCardDetails,
  DeleteCard,
} = require("../Controller/CardController");

const { protect } = require("../Controller/AuthController");

const router = express.Router();

router.route("/newCard/:bid").post(protect, createCard);
router.route("/updateCard/:id").patch(protect, updateCard);
router.route("/cards").get(protect, getAllCards);
router.route("/getCardDetails/:id").get(protect, getCardDetails);
router.route("/deleteCard/:id").delete(protect, DeleteCard);

module.exports = router;
