(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('LoginCtrl', Login);

    Login.$inject = ['$scope', '$log', 'Loginservice', '$location', '$ionicModal', 'localstorage', '$cordovaOauth', '$rootScope', '$http', '$ionicLoading', '$q', '$state', '$ionicPopup'] ;

    function Login($scope, $log, Loginservice, $location, $ionicModal, localstorage, $cordovaOauth, $rootScope, $http, $ionicLoading, $q, $state, $ionicPopup) {
      /* jshint validthis: true */
      var vm = this;

      vm.loginData = {};
      vm.submit = submitForm;
      vm.modal = openModal;
      vm.authFb = facebookSignIn;

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
        }, function(error) {
          alert("Error: displayData " + error);
        });
      }

      var fbLoginError = function(error){
        console.log('fbLoginError', error);
        $ionicLoading.hide();
      };

      var fbLoginSuccess = function(response) {
        if (!response.authResponse){
          fbLoginError("Cannot find the authResponse");
          return;
        }

        var authResponse = response.authResponse;

        getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          //for the purpose of this example I will store user data on local storage
          Loginservice.setUser({
            authResponse: authResponse,
    				userID: profileInfo.id,
    				name: profileInfo.name,
    				email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });
          $ionicLoading.hide();
          $location.path('app/map');
        }, function(fail){
          //fail get profile info
          $location.path('app/login');
          console.log('profile info fail', fail);
        });
      };


      var getFacebookProfileInfo = function (authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
          function (response) {
    				console.log(response);
            info.resolve(response);
          },
          function (response) {
    				console.log(response);
            info.reject(response);
          }
        );
        return info.promise;
      };

    function facebookSignIn() {
      facebookConnectPlugin.getLoginStatus(function(success){
       if(success.status === 'connected'){
          // the user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('getLoginStatus', success.status);

  				//check if we have our user saved
  				var user = Loginservice.getUser('facebook');
  				if(!user.userID)
  				{
  					getFacebookProfileInfo(success.authResponse)
  					.then(function(profileInfo) {
  						//for the purpose of this example I will store user data on local storage
  						Loginservice.setUser({
  							authResponse: success.authResponse,
  							userID: profileInfo.id,
  							name: profileInfo.name,
  							email: profileInfo.email,
  							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
  						});

              var authFBData = {
                email: profileInfo.email,
                accessToken: authResponse.accessToken,
                fbID: success.authResponse.userID
              }
              Loginservice.authFacebook(authFBData).then(function(result){
                $location.path('app/map');
              }, function(err){
                if (err === 401) { $location.path('app/login'); }
                else {$log.warn('status error: ', err)}
              });

  					}, function(fail){
  						//fail get profile info
              $location.path('app/login');
  					});
  				}else{
            var authFBData = {
              email: success.authResponse.email,
              accessToken: success.authResponse.accessToken,
              fbID: success.authResponse.userID
            }
            Loginservice.authFacebook(authFBData).then(function(result){
              // $ionicPopup.alert({
              //    title: 'User',
              //    template: authFBData.fbID
              //  });
              localstorage.saveUser(result);
              $location.path('app/map');
            }, function(err){
              if (err === 401) { $location.path('app/cadastro'); }
              else {console.warn('status error: ', err)}
            })
            // $location.path('app/map');
  				}

       } else {
          //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
          //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
          console.log('getLoginStatus', success.status);

  			  $ionicLoading.show({
            template: 'Fazendo login'
          });
       //
      //     //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
      });
    }
  }




})();
