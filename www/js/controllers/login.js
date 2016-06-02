(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('LoginCtrl', Login);

    Login.$inject = ['$scope', '$log', 'Loginservice', '$location', '$ionicModal', 'localstorage', '$cordovaOauth', '$rootScope'];

    function Login($scope, $log, Loginservice, $location, $ionicModal, localstorage, $cordovaOauth, $rootScope) {
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
        var params = vm.loginData;

        return Loginservice.authEmail(params).then(function(result) {
          $log.info('Loginservice.authEmail: ', result);

          localstorage.saveUser(result);
          $scope.modal.hide();
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
        $cordovaOauth.facebook("351112045059351", ["email", "public_profile"]).then(function(result) {
          $rootScope.fb = result;
            // results
        }, function(error) {
          window.alert('error', error);
            // error
        });
      }


    }




})();
