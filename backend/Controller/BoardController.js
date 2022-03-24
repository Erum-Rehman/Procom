const Board = require("../Model/Board");
const APIFeatures = require("../Utils/BoardAPIFeatures.js");
const CatchAsync = require("../Utils/CatchAsync");
const AppError = require("../Utils/ErrorHandler")

exports.createBoard = CatchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const newBoard = await Board.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      whoCreated: req.body.user,
      Board: newBoard,
    },
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

exports.getBoardDetails = CatchAsync(async (req, res, next) => {
    const boardQuery = new APIFeatures(Board.findById(req.params.id), req.query)
    .filter()
    .limitFields()
    .paginate()
    .search()
    .sort();
    const boardDetails = await boardQuery.query;
    if (!boardDetails) {
      return next(new AppError("No Product found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: boardDetails,
    });
  });

  exports.updateBoard = CatchAsync(async (req, res, next) => {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBoard) {
      return next(new AppError("No Product found with that ID", 404));
    } else {
      res.status(200).json({
        status: "success",
        data: updatedBoard,
      });
    }
  });
