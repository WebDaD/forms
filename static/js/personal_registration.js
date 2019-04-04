/* global $, window */
$(document).ready({
  // conditionals
  $('#participation').on('change', function(){
    if($('#participation').val() === 'voter') {
      $('#voting').show()
    } else {
      $('#voting').hide()
    }
  })

  // TODO: validation (if needed)

  submit(window.location.pathname, function (error, id) {
    if (error) {
      // TODO: writeout error
    } else {
      window.location.href += '/thankyou/' + id
    }
  })
})
