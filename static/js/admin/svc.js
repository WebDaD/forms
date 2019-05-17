/* global angular */
;(function () {
  angular.module('forms')
    .provider('formsDataProvider', function formsDataProvider () {
      var restURL = '/'
      this.setURL = function (url) {
        restURL = url
      }
      this.$get = function ($http) {
        return {
          dashboard: function () {
            return $http({
              method: 'GET', url: restURL + 'api/dashboard'
            })
          },
          submissions: function (slug) {
            return $http({
              method: 'GET', url: restURL + 'api/submissions/' + slug
            })
          }
        }
      }
    })
}())
