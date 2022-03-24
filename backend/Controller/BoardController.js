const Board = require("../Model/Board")
const CatchAsync = require("../Utils/CatchAsync")

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