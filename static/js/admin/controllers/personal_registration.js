/* global angular */ ;
(function () {
  angular.module('forms')
    .controller('forms-personal_registration', ['formsDataProvider', function (formsDataProvider) {
      var self = this
      self.submissions = []
      formsDataProvider.submissions('personal_registration').then(function (result) {
        self.submissions = result.data
      })
    }])
}())
