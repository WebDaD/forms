/* global angular */ ;
(function () {
  angular.module('forms')
    .controller('forms-form', ['formsDataProvider', '$routeParams', function (formsDataProvider, $routeParams) {
      var self = this
      self.form = $routeParams.form
      self.submissions = []
      formsDataProvider.submissions(self.form).then(function (result) {
        self.submissions = result.data
      })
    }])
}())
