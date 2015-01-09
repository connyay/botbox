'use strict';

angular.module('botboxApp')
  .controller('NavbarCtrl', function ($scope) {
    $scope.menu = [{
      'title': 'Search',
      'state': 'search'
    }];

    $scope.isCollapsed = true;
  });
