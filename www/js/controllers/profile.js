(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('ProfileCtrl', Profile);

    Profile.$inject = ['$scope'];

    function Profile($scope) {
      /* jshint validthis: true */
      var vm = this;

      console.warn('ProfileCtrl');
    }

})();
