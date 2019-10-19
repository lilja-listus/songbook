const express = require("express");
const router = express.Router();

let Song = require("../models/song");
let User = require("../models/user");

router.get("/add", (req, res) => {
  res.render("add_song", {
    title: "Add song"
  });
});

router.post("/add", (req, res) => {
  req.checkBody("title", "Title is required").notEmpty();
  req.checkBody("body", "Body is required").notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    res.render("add_song", {
      title: "Add songs",
      errors: errors
    });
  } else {
    let song = new Song();

    song.title = req.body.title;
    song.body = req.body.body;
    song.language = req.body.language;

    song.save(err => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Song Added");
        res.redirect("/");
      }
    });
  }
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Song.findById(req.params.id, (err, song) => {
    res.render("edit_song", {
      title: "Edit Song",
      song: song
    });
  });
});

router.post("/edit/:id", (req, res) => {
  let song = {};

  song.title = req.body.title;
  song.body = req.body.body;
  song.language = req.body.language;

  let query = { _id: req.params.id };

  Song.update(query, song, err => {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Song Updated");
      res.redirect("/");
    }
  });
});

router.delete("/:id", (req, res) => {
  let query = { _id: req.params.id };
  Song.findById(req.params.id, (err, song) => {
    Song.remove(query, err => {
      if (err) {
        console.log(err);
      }
      res.send("Success");
    });
  });
});

router.get("/:id", (req, res) => {
  Song.findById(req.params.id, (err, song) => {
    if (err) {
      console.log(err);
    } else {
      res.render("song", {
        song: song
      });
    }
  });
});

//Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}

module.exports = router;
