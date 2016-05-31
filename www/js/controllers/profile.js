(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('ProfileCtrl', Profile);

    Profile.$inject = ['$scope', '$ionicActionSheet', '$ionicModal', '$location', '$rootScope', 'GardenApi', '$log', 'UserApi', 'localstorage'];

    function Profile($scope, $ionicActionSheet, $ionicModal, $location, $rootScope, GardenApi, $log, UserApi, localstorage) {
      /* jshint validthis: true */
      var vm = this;

      vm.action = showAction;
      vm.modal = showModal;
      vm.addItem = addItem;
      vm.logout = logout;
      vm.lookup = lookup;

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
        return submitItem().then(function() {
          vm.lookup();
        });
      }

      function submitItem() {
        var params = vm.formData;

        return GardenApi.addItem(params).then(function(result) {
          $log.info('addItem: ', result);
          $scope.modal.hide();
        }, function(err) {
          $scope.modal.hide();

          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        })
      }

      function lookup() {
        return getUser().then(function() {
          // console.warn('acabei')
        });
      }

      function getUser() {
        return UserApi.lookup().then(function(result) {
          localstorage.saveUser(result);
          $log.info('lookup: ', result);
        }, function(err) {
          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        })
      }

      function logout() {
        localStorage.removeItem('HORTA_APP');
        delete $rootScope.user;

        $location.path('login');
      }

    }

})();
