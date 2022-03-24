const User = require("../Model/UserModel")
const CatchAsync = require("../Utils/CatchAsync")


exports.getAllUsers = CatchAsync(async (req, res, next) => {
    const users = await User.find();
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  });