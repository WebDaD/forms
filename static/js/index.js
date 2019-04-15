/* global $ */
$(document).ready(function () {
  // activate datetime fields (min max)
  $('.datepicker-here').each(function () {
    var self = $(this)
    if (self.data('mymindate')) {
      if (self.data('mymindate') === 'today') {
        self.datepicker({ minDate: new Date() })
      } else if (self.data('mymindate').startsWith('#')) {
        self.datepicker({ minDate: $(self.data('mymindate')).datepicker().data('datepicker').selectedDates[0] })
      } else {
        self.datepicker({ minDate: new Date(self.data('mymindate')) })
      }
    }
    if (self.data('mymaxdate')) {
      if (self.data('mymaxdate') === 'today') {
        self.datepicker({ maxDate: new Date() })
      } else if (self.data('mymaxdate').startsWith('#')) {
        self.datepicker({ maxDate: $(self.data('mymaxdate')).datepicker().data('datepicker').selectedDates[0] })
      } else {
        self.datepicker({ maxDate: new Date(self.data('mymaxdate')) })
      }
    }
  })

  // switch switchable fields on change
  $('[data-visible]').each(function () {
    var self = $(this)
    var control = self.data('visible').split('=')[0]
    var onState = self.data('visible').split('=')[1]
    if ($('#' + control).val() === onState) {
      self.show()
    } else {
      self.hide()
    }
    $('#' + control).on('change', function () {
      if ($(this).val() === onState) {
        self.show()
      } else {
        self.hide()
      }
    })
  })

  // validate on the fly
  $('[data-validation]').each(function () {
    var self = $(this)
    self.on('keyup', function () {
      let checkOK = false
      switch (self.data('validation')) {
        case 'email': checkOK = validateEmail(self.val())
      }
      if (checkOK) {
        self.removeClass('is-invalid')
        self.addClass('is-valid')
        self.parent().find('.invalid-message').hide()
      } else {
        self.removeClass('is-valid')
        self.addClass('is-invalid')
        self.parent().find('.invalid-message').show()
      }
    })
  })

  $('#submit').click(function () {
    // TODO: post when all required have date, no class is-invalid is present

    // TODO: POST all data as JSON to Server

    // TODO: if OK, replace form with response (thankyou)
  })
})

function validateEmail (email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
