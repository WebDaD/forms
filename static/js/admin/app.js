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
        .when('/personal_registration', {
          controller: 'forms-personal_registration',
          controllerAs: 'ctrl',
          templateUrl: '/admin/personal_registration'
        })
        .otherwise({ redirectTo: '/' })
    }])
    .run(['$cookies', '$http', function ($cookies, $http) {
      $http.defaults.headers.common.token = $cookies.get('ftoken')
    }])
}())
