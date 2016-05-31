(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .factory('UserApi', UserApi);

    UserApi.$inject = ['$http', 'ApiConfig', '$log', '$q'];

    function UserApi($http, ApiConfig, $log, $q) {
      var apiUrl;

      apiUrl = ApiConfig.API_URL;

      return {
        lookup: lookup
      };

      function lookup() {
        return $http.get(apiUrl + '/api/v1/me/',{ headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('authorization')
        }}).then(success).catch(error);

        function success(response) {
          return response.data;
        }

        function error(err) {
          return $q.reject(err.status);
        }
      }

    }

})();
