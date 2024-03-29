// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })

    .state('cadastro', {
      url: '/cadastro',
      templateUrl: 'templates/cadastro.html',
      controller: 'CadastroCtrl',
      controllerAs: 'cadastro'
    })

    .state('esqueciSenha', {
      url: '/esqueci-senha',
      templateUrl: 'templates/esqueci-senha.html',
      // controller: 'UserCtrl',
      // controllerAs: 'cadastro'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu-primary.html'
    })

    .state('app.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/map.html',
          controller: 'GeoCtrl',
          controllerAs: 'geo'
        }
      }
    })

    .state('app.profile', {
      url: '/profile',
      views: {
        'tab-profile': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl',
          controllerAs: 'profile'
        }
      }
    })

    .state('app.favorites', {
      url: '/favorites',
      views: {
        'tab-favorites': {
          templateUrl: 'templates/favorites.html',
          controller: 'FavoritesCtrl',
          controllerAs: 'fav'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

// checkloggedout.$inject =  ['checkloggedout'];

// function checkloggedout(checkloggedout) {
//   return checkloggedout.getStatus();
// }
