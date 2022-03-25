//handled uncought exeption
process.on("uncaughtException", (err) => {
  console.log(`Error:${err}`);
  console.log("Shutting down the server due to uncought exeption error");
  process.exit(1);
});

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/Database");
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`server is working fine on http://localhost:${process.env.PORT}`);
});

// Unhandled promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
