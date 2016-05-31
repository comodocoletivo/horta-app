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
        addItem: addItem,
        removeItem: removeItem
      };

      function getAll() {
        return $http.get(apiUrl + '/api/v1/markets/', { headers: {
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

      function removeItem(data) {
        var obj, config;

        obj = data;

        config = {
          data: JSON.stringify(obj),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('authorization')
          }
        };

        return $http.delete(apiUrl + '/api/v1/garden/', config).then(success).catch(error);

        function success(response) {
          return response.data;
        }

        function error(err) {
          return $q.reject(err.status);
        }
      }
    }

})();
