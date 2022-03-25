const Board = require("../Model/Board");
const APIFeatures = require("../Utils/APIFeatures.js");
const CatchAsync = require("../Utils/CatchAsync");
const AppError = require("../Utils/ErrorHandler");

exports.createBoard = CatchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const newBoard = await Board.create({
    title: req.body.title,
    description: req.body.description,
    addMember: req.body.addMember,
  });
  res.status(201).json({
    status: "success",
    data: {
      whoCreateBoard: req.body.user,
      Board: newBoard,
    },
  });
});

exports.getBoardDetails = CatchAsync(async (req, res, next) => {
  const boardDetails = await Board.findById(req.params.id);
  if (!boardDetails) {
    return next(new AppError("No Product found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: boardDetails,
  });
});

exports.getAllBorads = CatchAsync(async (req, res, next) => {
  const Boards = await Board.find();
  res.status(200).json({
    status: "success",
    items: `${Boards.length}`,
    Data: Boards,
  });
});

exports.DeleteBoard = CatchAsync(async (req, res, next) => {
  const deleteBoard = await Board.findByIdAndRemove(req.params.id);
  if (!deleteBoard) {
    return next(new AppError("No Product found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: deleteBoard,
  });
});
