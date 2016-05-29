(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('LoginCtrl', Login);

    Login.$inject = ['$scope', '$log', 'Loginservice', '$location'];

    function Login($scope, $log, Loginservice, $location) {
      /* jshint validthis: true */
      var vm = this;

      vm.loginData = {};
      vm.submit = submitForm;

      function submitForm() {
        return submit().then(function() {
          $location.path('app/map')
          // $rootScope.progressbar.complete();
        })
      }

      function submit() {
        // $rootScope.progressbar.start();

        var params = vm.loginData;

        return Loginservice.authEmail(params).then(function(result) {
          $log.info('Loginservice.authEmail: ', result);
        }, function(err) {
          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        })
      }


    };

})();
