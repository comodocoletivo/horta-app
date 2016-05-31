(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('ProfileCtrl', Profile);

    Profile.$inject = ['$scope', '$ionicActionSheet'];

    function Profile($scope, $ionicActionSheet) {
      /* jshint validthis: true */
      var vm = this;

      vm.action = showAction;

      function showAction(id) {
        var id, hideSheet;

        id = id;

       hideSheet = $ionicActionSheet.show({
         buttons: [{ text: 'Sim' }],
         titleText: 'Remover item da horta',
         cancelText: 'Cancel',
         cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          console.log('id foi', id)
         return true;
       }

     });
      }
    }

})();
