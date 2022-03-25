const mongoose = require("mongoose");

const card = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide the Card titlte!"],
    maxLenght: [30, "name cannot exceed 30 character"],
    minLenght: [4, "name should have more than 4 character"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide the Card description!"],
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, "Please provide the card category!"],
  },
  BoardId: String,
  priority: String,
  startTime:{
    type: Date,
    default: Date.now(),
  },
  endTime: {
    type: Date,
    default: Date.now() + (1*24*60*60*1000),
  },
  progress: String,
  
  addMemberId: {
    type: String,
  },
  
});

module.exports = mongoose.model("card", card);
