require("dotenv").config();
const express = require("express");
const unirest = require("unirest");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const apiKey = process.env.IMDB_API_KEY;

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, response) {
  response.render("home.ejs", {
    movieTitle: null,
    moviePoster: null,
    moviePlot: null,
    movieActors: null,
    error: null
  });
});

app.post("/", function(req, response) {
  var results = {};

  function callback() {
    let localTitle = results.Title;
    let localPoster = results.Poster;
    let localPlot = results.Plot;
    let localActors = "ACTORS: " + results.Actors;
    response.render("home.ejs", {
      movieTitle: localTitle,
      moviePoster: localPoster,
      moviePlot: localPlot,
      movieActors: localActors,
      error: null
    });
  }

  unirest
    .get("https://movie-database-imdb-alternative.p.rapidapi.com/")
    .query({ page: "1", r: "JSON", t: req.body.movieName })
    .headers({
      "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
      "x-rapidapi-key": apiKey
    })
    .end(function(res) {
      if (res.error) throw new Error(res.error);
      results = res.body;
      callback();
    });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000...");
});
