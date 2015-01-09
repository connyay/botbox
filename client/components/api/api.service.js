'use strict';

angular.module('botboxApp')
  .factory('api', function($http) {
    var ROOT = '/api/';
    return {
      search: function(search) {
        return $http.post(ROOT + 'messages/search', search);
      },
      getRooms: function() {
        return $http.get(ROOT + 'messages/rooms');
      }
    };
  });
