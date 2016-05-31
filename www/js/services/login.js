(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .factory('Loginservice', Loginservice);

    Loginservice.$inject = ['$http', 'ApiConfig', '$log', '$q'];

    function Loginservice($http, ApiConfig, $log, $q) {
      var apiUrl;

      apiUrl = ApiConfig.API_URL;

      return {
        authEmail: authEmail
      };

      function authEmail(data) {
        return $http.post(apiUrl + '/api/v1/auth/', data, { headers: {
          'Content-Type': 'application/json'
        }}).then(success).catch(error);

        function success(response) {
          sessionStorage.setItem('authorization', response.headers()['authorization']);
          return response.data;
        }

        function error(err) {
          return $q.reject(err.status);
        }
      }
    }

})();
