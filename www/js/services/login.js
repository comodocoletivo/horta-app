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
        authEmail: authEmail,
        authFacebook: authFacebook
      };

      function authEmail(data) {
        return $http.post(apiUrl + '/api/v1/auth/', data, { headers: {
          'Content-Type': 'application/json'
        }}).then(success).catch(error);

        function success(response) {
          console.warn('HEADER', response.headers()['authorization']);
          sessionStorage.setItem('authorization', response.headers()['authorization']);
          return response.data;
        }

        function error(err) {
          return $q.reject(err.status);
        }
      }

      function authFacebook(data) {
        return $http.post(apiUrl + '/api/v1/auth/', data, { headers: {
          'Content-Type': 'application/json'
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
