const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const logger = require("morgan");

const db = require("./config/database");

const app = express();

// Loads .env file contents into process.env.
dotenv.config();
const port = process.env.PORT;

// create server
const server = http.createServer(app);

// connect db
db.connect();

//app level middleware
app.use(express.json());
app.use(logger("dev"));

app.use("*", (request, response) => {
  response.status(200).send({ response: "Status is live" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
