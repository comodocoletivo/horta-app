(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .factory('GardenApi', GardenApi);

    GardenApi.$inject = ['$http', 'ApiConfig', '$log', '$q'];

    function GardenApi($http, ApiConfig, $log, $q) {
      var apiUrl;

      apiUrl = ApiConfig.API_URL;

      return {
        getAll: getAll,
        addItem: addItem
      };

      function getAll(data) {
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

      function addItem(data) {
        return $http.post(apiUrl + '/api/v1/garden/', data, { headers: {
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
