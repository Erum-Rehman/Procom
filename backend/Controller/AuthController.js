const User = require("../Model/UserModel");
const CatchAsync = require("../Utils/CatchAsync");
const AppError = require("../Utils/ErrorHandler");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../Utils/Email");


const JWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = JWTToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.userSignUp = CatchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
    user: req.body.user,
  });

  createSendToken(newUser, 200, res);
});

exports.login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password acually exists
  if (!email || !password) {
    return next(new AppError("Please provide email and Password", 400));
  }
  // 2) check if user exists and is password correct or not?
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Incorrect Email or Password"), 401);
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return next(new AppError("Incorrect Email or Paasword"), 401);
  }

  // 3) is everything ok? then send token to the client

  //   sendToken(user, 200, res, "login");

  //   const token = JWTToken(user._id);

  //   res.status(200).json({
  //     status: "success",
  //     token: token,
  //   });
  createSendToken(user, 200, res);
});

exports.protect = CatchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }

  const { token } = req.cookies;

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action"),
        404
      );
    }
    next();
  };
};

exports.forgotPassword = CatchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = CatchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT

  //   const token = JWTToken(user._id);

  //   res.status(200).json({
  //     status: "success",
  //     token: token,
  //   });
  createSendToken(user, 200, res);
});

exports.updatePassword = CatchAsync(async (req, res, next) => {
  // 1) get user from the collection
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("Please login again!"), 401);
  }

  // 2) check if posted current password is currect
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    next(new AppError("Your current password is wrong.", 401));
  }

  // 3) if so, then update the password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4) log the user in.. send JWT
  //   const token = JWTToken(user._id);

  //   res.status(200).json({
  //     status: "success",
  //     token: token,
  //   });
  createSendToken(user, 200, res);
});

exports.logout = CatchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res.cookie("token", null, cookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logout successFully",
  });
});