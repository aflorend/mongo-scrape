// Requiring Mongoose
const mongoose = require("mongoose");
// Schema class
const Schema = mongoose.Schema;

// Creating Article Schema for scraped articles
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// Creating Article model using the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
mondule.exports = Article;
