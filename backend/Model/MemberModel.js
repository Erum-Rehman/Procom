const mongoose = require("mongoose");

const member = mongoose.Schema({
  memberName: {
    type: String,
  },
  memberEmail: {
    type: String,
  },
});

module.exports = mongoose.model("member", member);
