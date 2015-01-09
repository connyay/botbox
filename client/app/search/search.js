'use strict';

angular.module('botboxApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      });
  });
