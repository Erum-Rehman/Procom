const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your NAME!"],
    maxLenght: [30, "name cannot exceed 30 character"],
    minLenght: [4, "name should have more than 4 character"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide a valid EMAIL!"],
    validate: [validator.isEmail, "Please provide a valid EMAIL!"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a PASSWORD!"],
    minLenght: [8, "Password should have greater than 8 character"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please Confirm your PASSWORD!"],
    validate: {
      // this only works on save
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

UserModel.pre("save", async function (next) {
  // only run this function when the password was accually modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm Field
  this.confirmPassword = undefined;
  next();
});

UserModel.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserModel.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserModel.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

UserModel.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserModel);
