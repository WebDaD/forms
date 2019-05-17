/* global angular */ ;
(function () {
  angular.module('forms')
    .controller('forms-dashboard', ['formsDataProvider', function (formsDataProvider) {
      var self = this
      self.forms = []
      formsDataProvider.dashboard().then(function (result) {
        self.forms = result.data
      })
    }])
}())
