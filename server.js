// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
// Used to scrape
const request = require('request');
const cheerio = require('cheerio');
// Models
const Article = require('./models/Article.js');
const UserComment = require('./models/UserComment.js');
// Use ES6 Promises
mongoose.Promise = Promise;

// Initializing Express
var app = express();

// Using morgan logger and body parser middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Configure DB with mongoose
mongoose.connect('mongodb://heroku_x8bpf5q8:7957mhqvgnul9f4hmbcrub3cuh@ds127892.mlab.com:27892/heroku_x8bpf5q8');
var db = mongoose.connection;

// Using method override for delete routes with a query value
app.use(methodOverride('_method'));

// Show any errors from mongoose
db.on('error', function(error) {
  console.log('Mongoose Error: ', error);
});

// Log success message if logged in to db
db.once('open', function() {
  console.log('Mongoose connection successful.')
});

// Routes

// Get to scrape website
app.get('/', function(req, res) {
  // Grabbing entire body of html with request
  request('http://www.theonion.com/', function(error, response, html) {
    // Load html body into cheerio, then save it to $ as a shorthand selector
    var $ = cheerio.load(html);
    // Selecting info div
    $('.info').each(function(i, element) {
      // Saving empty result object
      var result = {};

      // Adding headline, links, summary and saving them as properties of result object
      result.title = $(this).find('.headline').find('a').attr('title');
      result.link = $(this).find('.headline').find('a').attr('href');

      // Create a new entry using the Article model
      var entry = new Article(result);

      // Save entry to the MongoDb, log errors, or log the doc.
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
  // Sends the index.html file
  res.sendFile(path.join(__dirname + '/public/index.html') );
});

// Get route to display articles that were scraped and saved to the MongoDB
app.get('/articles', function(req, res) {
  // Find all documents saved in the Article array
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// finding articles by ID
app.get('/articles/:id', function(req, res) {
  console.log(req.params.id);
  // Finds one article in the database that matches the id of the article being clicked
  Article.findOne({ '_id': req.params.id })
  // Populates user comments associated with the id
  .populate('userComment')
  // executes
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    // Sends the doc to the browser as a json
    else {
      res.json(doc)
    }
  });
});

// Creating a new user comment
app.post('/articles/:id', function(req, res) {
    // creates new comment and passes the request body to the entry
  var newComment = new UserComment(req.body);
  // saves new comment to the database
  newComment.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      // Using the article id to find then update the comment
      Article.findOneAndUpdate({ '_id': req.params.id }, {$push: { 'userComment': doc._id }})
      // executes
      .exec(function(error, doc) {
        if (error) {
          console.log(error);
        }
        else {
          // send doc to the browser
          res.send(doc);
        }
      });
    }
  });
});

app.delete('/comments/:id?', function(req, res) {

  UserComment.findOneAndRemove({ '_id': req.params.id })
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.send(doc);
    }
  });
});

// Make public a static dir
app.use(express.static("public"));

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000");
});
