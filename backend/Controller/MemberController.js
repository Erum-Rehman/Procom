const Member = require("../Model/MemberModel");
const UserModel = require("../Model/UserModel");
const CatchAsync = require("../Utils/CatchAsync");

exports.getMembers = CatchAsync(async (req, res, next) => {
  const Members = await Member.find();

  res.status(200).json({
    status: "success",
    results: Members.length,
    data: {
      Members,
    },
  });
});

exports.createMember = CatchAsync(async (req, res, next) => {
  const User = await UserModel.findById(req.params.M_id);
  const newMember = await Member.create({
    _id: User._id,
    memberName: User.name,
    memberEmail: User.email,
  });
  res.status(201).json({
    status: "success",
    data: {
      Member: newMember,
    },
  });
});
