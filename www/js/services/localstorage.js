(function() {

  'use strict';

  angular.module('starter.controllers')
    .service('localstorage', localstorage);

    localstorage.$inject = ['$rootScope'];

    function localstorage($rootScope) {
      var user_storage;

      return {
        saveUser: saveUser,
        getItem: getItem
      };

      function saveUser(obj) {
        user_storage = obj;

        localStorage.setItem('HORTA_APP', JSON.stringify(user_storage));

        $rootScope.user = user_storage;
      }

      function getItem(key) {
        return JSON.parse(localStorage.getItem(key));
      }
    }

})();
