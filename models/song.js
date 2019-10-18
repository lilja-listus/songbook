let mongoose = require("mongoose");

let songSchema = {
  title: { type: String, required: true },
  language: { type: String, required: true },
  body: { type: String, required: true }
};

let Song = (module.exports = mongoose.model("Song", songSchema));
