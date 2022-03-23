const AppError = require("../Utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  err.status = err.status || "error";

  // mongoDb handled cast Error
  if (err.name === "CastError") {
    err = new AppError(`Resource not found, Invalid: ${err.path}`, 400);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};