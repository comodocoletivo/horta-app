(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('FavoritesCtrl', Favorites);

    Favorites.$inject = ['$scope'];

    function Favorites($scope) {
      /* jshint validthis: true */
      var vm = this;

      console.warn('FavoritesCtrl');
    }

})();
