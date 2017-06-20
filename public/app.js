// Getting articles from the API as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(`<p>${data[i].title}<br /><a href="http://theonion.com${data[i].link}" target="_blank">Read Article</a> <a class="comment" data-id="${data[i]._id}">Comment</a></p>`);
  }
});

// Reload page to populate scraped articles
$('button.refresh').on('click', function() {
  location.reload();
});

// When comment button is clicked...
$(document).on('click', 'a.comment', function() {
  // Empties previous comments
  $('#notes').empty();
  $('#user-comments').empty();

  var clickedId = $(this).attr('data-id');

  // AJAX call to retreive any articles with the clicked article ID
  $.ajax({
    method: 'GET',
    url: `/articles/${clickedId}`
  })

  .done(function(data) {
    console.log(data);
    // Populating comment text input area with specific aritlce title and ID data
    $('#notes').append(`<h2>${data.title}</h2>`);
    $('#notes').append('<input id="titleinput" name="title">');
    $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
    $('#notes').append(`<button data-id="${data._id}" id="savenote">Save Note</button>`);

    // If there are any comments, add comments to the user comment area
    if (data.userComment.length > 0) {
      for (var i = 0; i < data.userComment.length; i++) {
        $('#user-comments').append(`<div data-id="${clickedId}" data-comment-id="${data.userComment[i]._id}"><h4>${data.userComment[i].title}</h4><p>${data.userComment[i].text}</p><button type="button" class="delete"">Delete</button></div>`);
      }
    }
  });
})

// Click handler for saving comments
$(document).on('click', '#savenote', function() {
  var clickedId = $(this).attr('data-id');

  // Uses article id to save comment text and title to db
  $.ajax({
    method: 'POST',
    url: `/articles/${clickedId}`,
    data: {
      title: $('#titleinput').val(),
      text: $('#bodyinput').val()
    }
  })
  .done(function(data) {
    console.log(data);
    // empty the notes section
    $('#notes').empty();
    // trigger comment click to reload posted quotes
    $(`a.comment[data-id='${clickedId}']`).trigger('click');
  });
  // Empties comment text inputs
  $('#titleinput').val('');
  $('#bodyinput').val('');
});

// Click handler for deleting comments
$(document).on('click', 'button.delete', function() {
  var articleId = $(this).parent().attr('data-id');
  var commentId = $(this).parent().attr('data-comment-id');

  // Uses method override to send a method of delete
  $.ajax({
    method: 'POST',
    url: `/comments/${commentId}?_method=DELETE`
  }).done(function() {
    // trigger comment click to reload posted quotes
    $(`a.comment[data-id='${articleId}']`).trigger('click');
  })
  // Removes the comment from the page
  $(this).parent().empty();
});
