'use strict';

angular.module('botboxApp')
  .controller('SearchCtrl', function($scope, $http) {
    $scope.searchText = '';
    $scope.notFound = false;
    $scope.doSearch = function() {
      console.log('Search ', $scope.searchText);
      $http.post('/api/messages/search', {
        text: $scope.searchText
      }).success(function(results) {
        $scope.results = results;
        $scope.notFound = false;
      }).error(function() {
        $scope.notFound = true;
        delete $scope.results;
      });
    };
  });
