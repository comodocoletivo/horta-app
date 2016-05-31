(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('ProfileCtrl', Profile);

    Profile.$inject = ['$scope', '$ionicActionSheet', '$ionicModal'];

    function Profile($scope, $ionicActionSheet, $ionicModal) {
      /* jshint validthis: true */
      var vm = this;

      vm.action = showAction;
      vm.modal = showModal;
      vm.addItem = addItem;

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

      function showModal() {
        $ionicModal.fromTemplateUrl('templates/modals/add-item.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }

      function addItem() {
        console.log('hey you');
      }

    }

})();
