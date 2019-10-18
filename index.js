const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/database");

mongoose.connect(config.database);

let db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", () => {
  console.log(err);
});

const app = express();

let Song = require("./models/song");

app.get("/", (req, res) => {
  res.send("Works");
});

app.listen(3000, () => {
  console.log("Server runs on the port 3000");
});
