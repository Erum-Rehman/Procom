const mongoose = require("mongoose");
const { type } = require("os");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

const Board = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide the BOARD titlte!"],
    maxLenght: [30, "name cannot exceed 30 character"],
    minLenght: [4, "name should have more than 4 character"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide the BOARD description!"],
    trim: true,
    lowercase: true,
  },
  task: [
    {
      Todo: [
        {
          title: String,
          description: String,
          priority: String,
          assignee: String,
        },
      ],
    },
    {
      progress: [
        {
          title: String,
          description: String,
          priority: String,
          assignee: String,
        },
      ],
    },
    {
      codeReview: [
        {
          title: String,
          description: String,
          priority: String,
          assignee: String,
        },
      ],
    },
    {
      done: [
        {
          title: String,
          description: String,
          priority: String,
          assignee: String,
        },
      ],
    },
  ],
 
  status: String,
});

module.exports = mongoose.model("Board", Board);
