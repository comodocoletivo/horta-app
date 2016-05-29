(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .service('checkloggedout', checkloggedout);

    checkloggedout.$inject = ['$q', '$timeout', '$location', '$rootScope'];

    function checkloggedout($q, $timeout, $location, $rootScope) {

      return {
        getStatus: getStatus
      };

      function getStatus() {
        var deferred = $q.defer();

        if ($rootScope.user) {
          console.log('tem user');

          // deferred.resolve();
        } else {
          console.log('não tem user');
          // $timeout(deferred.reject);

          // return console.info('fail');
          // return $location.url('/login');
        }

        // return deferred.promise;
      }

    }


})();
