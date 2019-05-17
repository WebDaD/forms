/* global $ */
$(document).ready(function () {
  $('#login').click(function () {
    $.ajax({
      type: 'POST',
      url: '/admin/login',
      data: JSON.stringify({
        username: $('#username').val(),
        password: $('#password').val()
      }),
      contentType: 'application/json',
      dataType: 'json'
    }).done(function (response) {
      document.cookie = 'ftoken=' + response
      window.location.replace('/admin/')
    }).fail(function (error) {
      console.error(error)
      // TODO: display error
    })
  })
})
