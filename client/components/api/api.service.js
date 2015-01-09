'use strict';

angular.module('botboxApp')
  .factory('api', function($http) {
    var ROOT = '/api/';
    return {
      search: function(search) {
        return $http.post(ROOT + 'messages/search', search);
      },
      display: function(display) {
        return $http.post(ROOT + 'messages/display', display);
      },
      getRooms: function() {
        return $http.get(ROOT + 'messages/rooms');
      }
    };
  });
