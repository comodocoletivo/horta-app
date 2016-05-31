(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('LoginCtrl', Login);

    Login.$inject = ['$scope', '$log', 'Loginservice', '$location', '$ionicModal'];

    function Login($scope, $log, Loginservice, $location, $ionicModal) {
      /* jshint validthis: true */
      var vm = this;

      vm.loginData = {};
      vm.submit = submitForm;
      vm.modal = openModal;
      vm.authFb = authFb;

      function submitForm() {
        return submit().then(function() {
          // $rootScope.progressbar.complete();
        })
      }

      function submit() {
        // $rootScope.progressbar.start();

        var params = vm.loginData;

        return Loginservice.authEmail(params).then(function(result) {
          $scope.modal.hide()
          $log.info('Loginservice.authEmail: ', result);
          $location.path('app/map');
        }, function(err) {
          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        })
      }

      function openModal(args) {
        var params = args;

        if (params === 'email') {
          emailModal();
        }
      }

      function emailModal() {
        $ionicModal.fromTemplateUrl('templates/modals/login-email.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      }

      function authFb() {
        console.log('login por facebook')
      }


    };

})();
