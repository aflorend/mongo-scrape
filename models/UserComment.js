// Require Mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Creating Comment Schema
var UserCommentSchema = new Schema ({
  title: {
    type: String
  },
  text: {
    type: String
  }
});

var UserComment = mongoose.model("UserComment", UserCommentSchema);

mondule.exports = UserComment;
