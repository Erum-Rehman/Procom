const Card = require("../Model/CardModel");
const CatchAsync = require("../Utils/CatchAsync");
const AppError = require("../Utils/ErrorHandler");
const APIFeatures = require("../Utils/APIFeatures");

exports.createCard = CatchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const newCard = await Card.create({
    BoardId: req.params.bid,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category, //lists: todo, progress, code Review and done
    priority: req.body.priority,
    progress: req.body.progress,
    addMemberId: req.body.addMemberId,
  });
  res.status(201).json({
    status: "success",
    data: {
      Card: newCard,
    },
  });
});

exports.updateCard = CatchAsync(async (req, res, next) => {
  const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedCard) {
    return next(new AppError("No Product found with that ID", 404));
  } else {
    res.status(200).json({
      status: "success",
      updatedCard,
    });
  }
});

exports.DeleteCard = CatchAsync(async (req, res, next) => {
  const deleteCard = await Card.findByIdAndRemove(req.params.id);
  if (!deleteCard) {
    return next(new AppError("No Product found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: deleteCard,
  });
});

exports.getAllCards = CatchAsync(async (req, res, next) => {
  const cardQuery = new APIFeatures(Card.find(), req.query)
    .filter()
    .limitFields()
    .search()
    .sort();
  const cards = await cardQuery.query;
  console.log(req.query);
  res.status(200).json({
    status: "success",
    items: `${cards.length}`,
    Data: cards,
  });
});

exports.getCardDetails = CatchAsync(async (req, res, next) => {

  const cardDetails = await Card.findById(req.params.id);
  if (!cardDetails) {
    return next(new AppError("No Card not found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: cardDetails,
  });
});
