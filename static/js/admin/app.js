/* global angular */
;(function () {
  angular.module('forms', ['ngRoute', 'ngCookies', 'ngAnimate', 'ui.bootstrap'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          controller: 'forms-dashboard',
          controllerAs: 'ctrl',
          templateUrl: '/admin/dashboard'
        })
        .when('/:form', {
          controller: 'forms-form',
          controllerAs: 'ctrl',
          templateUrl: function ($routeParams) {
            return '/admin/' + $routeParams.form
          }
        })
        .otherwise({ redirectTo: '/' })
    }])
    .run(['$cookies', '$http', function ($cookies, $http) {
      $http.defaults.headers.common.token = $cookies.get('ftoken')
    }])
}())
