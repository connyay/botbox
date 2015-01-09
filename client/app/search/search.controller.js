'use strict';

angular.module('botboxApp')
  .controller('SearchCtrl', function($scope, api) {
    $scope.search = {
      room: 'All Rooms',
      text: ''
    };

    $scope.rooms = [{
      name: 'Loading...',
      value: 'All Rooms'
    }];
    api.getRooms().success(function(rooms) {
      $scope.rooms = rooms;
    });
    $scope.notFound = false;
    $scope.doSearch = function() {
      if (!$scope.search.text) {
        return;
      }
      api.search($scope.search).success(function(results) {
        $scope.results = results;
        $scope.notFound = false;
      }).error(function() {
        $scope.notFound = true;
        delete $scope.results;
      });
    };
  });
