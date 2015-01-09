'use strict';

angular.module('botboxApp', [
  'ui.router'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/search');

    $locationProvider.html5Mode(true);
  })
  .filter('trust_html', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  });
