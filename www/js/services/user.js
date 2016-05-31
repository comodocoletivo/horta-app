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
        lookup: lookup,
        getAllFavorites: getAllFavorites,
        addFavorite: addFavorite
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

      function getAllFavorites() {
        return $http.get(apiUrl + '/api/v1/favorite/',{
          headers: {
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

      function addFavorite(data) {
        return $http.post(apiUrl + '/api/v1/favorite/', data, {
          headers: {
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
