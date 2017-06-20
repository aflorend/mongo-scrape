// Requiring Mongoose
const mongoose = require("mongoose");
// Requiring Mongoose unique validator to avoid duplicate scrape entries
const uniqueValidator = require('mongoose-unique-validator')

// Schema class
const Schema = mongoose.Schema;

// Creating Article Schema for scraped articles
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  userComment: [{
    type: Schema.Types.ObjectId,
    ref: "UserComment"
  }]
});

ArticleSchema.plugin(uniqueValidator);

// Creating Article model using the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
