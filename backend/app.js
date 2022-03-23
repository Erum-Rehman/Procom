const express = require("express");
const morgan = require("morgan");
const cookieParcer = require("cookie-parser");
const cors = require("cors");
const UserAuthentication = require("./Routes/AuthRoute")
const GlobalErrorHandler = require("./Controller/ErrorController") 
const AppError = require("./Utils/ErrorHandler");
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParcer());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("Hello from the Middleware");
  next();
});

app.use("/api/v1/user", UserAuthentication)

app.all("*", (req, res, next) => {
    // console.log("Wrong Url")
    // res.status(500).json({
    //   status: 'fail',
    //   message: `Invalid URl ${req.originalUrl} `
    // })
    // next()
  
    // const err = new Error(`Invalid URl ${req.originalUrl}`)
    // err.status = 'fail'
    // err.statusCode = 400
    // next(err)
  
    next(new AppError(`Invalid URl ${req.originalUrl}`), 500);
  });
  app.use(GlobalErrorHandler);

module.exports = app;
