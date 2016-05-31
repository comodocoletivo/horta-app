(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('CadastroCtrl', CadastroCtrl);

    CadastroCtrl.$inject = ['$scope', '$log', 'Loginservice', '$location', '$ionicModal', 'localstorage'];

    function CadastroCtrl($scope, $log, Loginservice, $location, $ionicModal, localstorage) {
      /* jshint validthis: true */
      var vm = this;

      vm.loginData = {};
      vm.submit = submitForm;
      vm.modal = openModal;
      vm.authFb = authFb;

      function submitForm() {
        return submit().then(function() {
        });
      }

      function submit() {
        var params = vm.cadastroData;

        return console.log(params);

        // return Loginservice.authEmail(params).then(function(result) {
        //   $log.info('Loginservice.authEmail: ', result);

        //   localstorage.saveUser(result);
        //   $scope.modal.hide();
        //   $location.path('app/map');
        // }, function(err) {
        //   if (err === 401) { console.log('não tem permissão') }
        //   else {$log.warn('status error: ', err)}
        // })
      }

      function openModal(args) {
        var params = args;

        if (params === 'email') {
          emailModal();
        }
      }

      function emailModal() {
        $ionicModal.fromTemplateUrl('templates/modals/cadastro-email.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }

      function authFb() {
        console.log('cadastro por facebook')
      }


    };

})();
