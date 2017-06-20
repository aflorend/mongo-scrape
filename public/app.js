// Getting articles from the API as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(`<p>${data[i].title}<br /><a href="http://theonion.com${data[i].link}" target="_blank">Read Article</a> <a class="comment" data-id="${data[i]._id}">Comment</a></p>`);
  }
});

// When comment button is clicked...
$(document).on('click', 'a.comment', function() {
  $('#notes').empty();
  $('#user-comments').empty();

  var clickedId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: `/articles/${clickedId}`
  })

  .done(function(data) {
    console.log(data);

    $('#notes').append(`<h2>${data.title}</h2>`);
    $('#notes').append('<input id="titleinput" name="title">');
    $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
    $('#notes').append(`<button data-id="${data._id}" id="savenote">Save Note</button>`);

    if (data.userComment.length > 0) {
      for (var i = 0; i < data.userComment.length; i++) {
        $('#user-comments').append(`<div data-comment-id=${data.userComment[i]._id}><h4>${data.userComment[i].title}</h4><p>${data.userComment[i].text}</p><button type="button" class="delete"">Delete</button></div>`);
      }
    }
  });
})

// Click handler for saving comments
$(document).on('click', '#savenote', function() {
  var clickedId = $(this).attr('data-id')

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
    $('#notes').empty();
  });

  $('#titleinput').val('');
  $('#bodyinput').val('');
});

$(document).on('click', 'button.delete', function() {

// TODO: Ajax call for delete

$(this).parent().empty();

});
