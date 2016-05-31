(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('FavoritesCtrl', Favorites);

    Favorites.$inject = ['$scope', 'UserApi', '$log'];

    function Favorites($scope, UserApi, $log) {
      /* jshint validthis: true */
      var vm = this;

      getAll();

      function getAll() {
        return get().then(function() {
        });
      }

      function get() {
        return UserApi.getAllFavorites().then(function(result) {
          $log.info('getAllFavorites: ', result.favorites);
          vm.all_favorites = result.favorites;
        }, function(err) {
          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        })
      }



    }

})();
