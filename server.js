// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Used to scrape
const request = require("request");
const cheerio = require("cheerio");
// Models
const Article = require("./models/Article.js");
const UserComment = require("./models/UserComment.js");
// Mongoose set to use JavaScript Promises
mongoose.Promise = Promise;

// Initializing Express
var app = express();

// Using morgan logger and body parser middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Public is a static directory
app.use(express.static("public"));

// Configure DB with mongoose
mongoose.connect("mongodb://localhost/articleScraper");
var db = mongoose.connection;

// Show any errors from mongoose
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Log success message if logged in to db
db.once("open", function() {
  console.log("Mongoose connection successful.")
});

// Routes

// Get to scrape website
app.get("/scrape", function(req, res) {
  request("")
})
