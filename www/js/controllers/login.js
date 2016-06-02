(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('LoginCtrl', Login);

    Login.$inject = ['$scope', '$log', 'Loginservice', '$location', '$ionicModal', 'localstorage', '$cordovaOauth', '$rootScope', '$http'];

    function Login($scope, $log, Loginservice, $location, $ionicModal, localstorage, $cordovaOauth, $rootScope, $http) {
      /* jshint validthis: true */
      var vm = this;

      vm.loginData = {};
      vm.submit = submitForm;
      vm.modal = openModal;
      vm.authFb = authFb;

      window.cordovaOauth = $cordovaOauth;
      window.http = $http;

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
        facebookLogin(window.cordovaOauth, window.http);

        // $cordovaOauth.facebook("351112045059351", ["email", "public_profile"]).then(function(result) {
        //   $rootScope.fb = result;
        //     // results
        // }, function(error) {
        //   window.alert('error', error);
        //     // error
        // });
      }

      function facebookLogin($cordovaOauth, $http) {
        $cordovaOauth.facebook("351112045059351", ["email", "public_profile"], {redirect_uri: "http://localhost:8100/callback"}).then(function(result){
          displayData($http, result.access_token);
        },  function(error){
          alert("Error: facebookLogin" + error);
        });
      }

      function displayData($http, access_token) {
        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: access_token, fields: "name,gender,location,picture", format: "json" }}).then(function(result) {
          var params = {};

          params.name = result.data.name;
          params.gender = result.data.gender;
          params.picture = result.data.picture;

          $rootScope.fb = params;

          // // var html = '<table id="table" data-role="table" data-mode="column" class="ui-responsive"><thead><tr><th>Field</th><th>Info</th></tr></thead><tbody>';
          // // html = html + "<tr><td>" + "Name" + "</td><td>" + name + "</td></tr>";
          // // html = html + "<tr><td>" + "Gender" + "</td><td>" + gender + "</td></tr>";
          // // html = html + "<tr><td>" + "Picture" + "</td><td><img src='" + picture.data.url + "' /></td></tr>";

          // // html = html + "</tbody></table>";

          // document.getElementById("listTable").innerHTML = html;
          // $.mobile.changePage($("#profile"), "slide", true, true);
        }, function(error) {
          alert("Error: displayData " + error);
        });
      }


    }




})();
