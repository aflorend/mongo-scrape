// Getting articles from the API as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<a data-id='" + data[i]._id + "' href='http://www.theonion.com" + data[i].link + "'>" + data[i].title + "<br /></a>");
  }
});
