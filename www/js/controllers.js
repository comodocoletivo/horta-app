angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('GeoCtrl', function($scope, $cordovaGeolocation, GardenApi) {

  // ====
  // obtém a localização do usuário
  var posOptions, coords;

  posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  $cordovaGeolocation.getCurrentPosition(posOptions)
  .then(function (position) {

    coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    $scope.user_location = coords;

    _initialize(coords);
  }, function(err) { console.warn(err) });
  // ====

  // ====
  // inicializa mapa
  function _initialize(args) {
    var ls_position, userPosition, map, userMarker, userRadius, styles, styledMap;

    userPosition = new google.maps.LatLng(args.lat, args.lng);

    map = new google.maps.Map(document.getElementById('map-primary'), {
      center: userPosition,
      zoom: 15,
      panControl: false,
      streetViewControl: false,
      zoomControl: true,
      scrollwheel: false,
      draggable: true,
      zIndex: 100,
      clickable: true,
      title: 'Você está aqui',
      mapTypeControl: false,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
    });

    $scope.bounds = new google.maps.LatLngBounds();

    $scope.geocoder = new google.maps.Geocoder();

    userMarker = new google.maps.Marker({
      position: userPosition,
      map: map,
      animation: google.maps.Animation.DROP
      // icon: '../../images/user-icon.png'
    });

    userRadius = new google.maps.Circle({
      map: map,
      radius: 200,
      fillColor: '#16663A',
      fillOpacity: 0.15,
      strokeOpacity: 0.51,
      strokeColor: '#16663A',
      strokeWeight: 1
    });

    styles =[
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#e9e9e9"
        },
        {
          "lightness": 17
        }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#CECECE"
        },
        {
          "lightness": 20
        }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 17
        }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 29
        },
        {
          "weight": 0.2
        }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 18
        }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#ffffff"
        },
        {
          "lightness": 16
        }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#f5f5f5"
        },
        {
          "lightness": 21
        }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#dedede"
        },
        {
          "lightness": 21
        }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#ffffff"
        },
        {
          "lightness": 16
        }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
        {
          "saturation": 36
        },
        {
          "color": "#333333"
        },
        {
          "lightness": 40
        }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
        {
          "visibility": "off"
        }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
        {
          "color": "#f2f2f2"
        },
        {
          "lightness": 19
        }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
        {
          "color": "#fefefe"
        },
        {
          "lightness": 20
        }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
        {
          "color": "#fefefe"
        },
        {
          "lightness": 17
        },
        {
          "weight": 1.2
        }
        ]
      }
    ];

    styledMap = new google.maps.StyledMapType(styles, {
      name: "Horta map"
    });

    userRadius.bindTo('center', userMarker, 'position');

    if (args === 'zoom') {
      map.setZoom(4);
      userMarker.setMap(null);
    };

    // Aplicando as configurações do mapa
    map.mapTypes.set('horta_map', styledMap);
    map.setMapTypeId('horta_map');

    // setando alguns métodos no $scope
    $scope.map = map;
    // $rootScope.map = map;
    $scope.userMarker = userMarker;

    $scope.$emit('map_ok');
  };

  function _addMarkers() {
    var arrayMarkers, infoWindow, marker;

    arrayMarkers = [];

    $scope.infowindow = new google.maps.InfoWindow();

    arrayMarkers = $scope.all_arr;

    $scope.mapsMarkers = [];
    $scope.marker_click = '';

    console.warn('arrayMarkers', arrayMarkers);

    for(var i = 0; i < arrayMarkers.length; i++ ) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(arrayMarkers[i].lat, arrayMarkers[i].lng),
        map: $scope.map,
        clickable: true,
        title: arrayMarkers[i].title,
        zIndex: 90,
        icon: _checkIcon(arrayMarkers[i].type),
        animation: google.maps.Animation.DROP,
        data: {
          "title": arrayMarkers[i].title,
          "geolocation": [arrayMarkers[i].lat, arrayMarkers[i].lng],
          "type": arrayMarkers[i].type,
          "link": arrayMarkers[i].link,
          "rating_value": arrayMarkers[i].rating_value,

          "email": arrayMarkers[i].email,
          "fullName": arrayMarkers[i].fullName,
          "garden": arrayMarkers[i].garden,
          "address": arrayMarkers[i].address,
          "id": arrayMarkers[i].id
        }
      });

      $scope.mapsMarkers.push(marker);

      // agrupa os marcadores na view
      $scope.bounds.extend(new google.maps.LatLng(arrayMarkers[i].lat, arrayMarkers[i].lng));
      $scope.map.fitBounds($scope.bounds);

      // Infowindow com o título da denúncia
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {

          $scope.$emit('marker_click', { marker: marker, id: i });

          if (marker.data.type !== 'garden') {
            // feiras
            var string = "<h5>" + marker.data.title + "</h5>" + "<p>Avaliações: " + "<b>" + marker.data.rating_value + "</b>" + "<p>" + "Mais informações: " + "<b>" + "<a href=" + marker.data.link + " target='_blank'>link</a>" + "</b>" + "</p>";

            $scope.infowindow.setContent(string);
          } else {
            // hortas
            $scope.infowindow.setContent(marker.data.fullName);
          }

          $scope.infowindow.open($scope.map, marker);

          // centraliza o mapa no marcador clicado
          $scope.map.panTo(marker.position);
        }
      })(marker, i));
    }
  };

  function _checkIcon(type) {
    if (type === 'garden') {
      return '../img/marker-garden.svg';
    } else {
      return '../img/marker-fairs.svg';
    }
  };

  function _getMarkersByApi() {
    var arr_gardens, arr_markets, all_arr, params;

    arr_gardens = [];
    arr_markets = [];

    params = $scope.user_location;

    GardenApi.All(params, function(response) {
      var gardens, markets;

      if (response.status === 200) {
        gardens = response.data.gardens;
        markets = response.data.markets;

        if (gardens.length > 0){
          angular.forEach(gardens, function(i) {
            arr_gardens.push({
              id: i._id,
              lat: i.geolocation[1],
              lng: i.geolocation[0],
              garden: i.garden,
              type: 'garden',
              email: i.email,
              fullName: i.fullName,
              address: 'Av cruz de rebouças, 1222, TIJIPIÓ - PE'
            })
          })
        } else { console.warn('nenhuma horta') }

        if (markets.length > 0){
          angular.forEach(markets, function(i) {
            arr_markets.push({
              id: i._id,
              title: i.title,
              lat: i.geolocation[1],
              lng: i.geolocation[0],
              rating_value: i.rating_value,
              type: i.type,
              link: i.link
            })
          })
        } else { console.warn('nenhuma feira') }

        all_arr = arr_gardens.concat(arr_markets);

        $scope.arr_gardens = arr_gardens;
        $scope.arr_markets = arr_markets;
        $scope.all_arr = all_arr;

        $scope.$emit('pins_ok');
      } else {
        Notification.show('Atenção', 'Tivemos um problema no nosso servidor, tente em instantes.');
      }
    });
  };


  // executando as funções
  $scope.$on('map_ok', function() {
    _getMarkersByApi();
  });

  $scope.$on('pins_ok', function() {
    _addMarkers();
  });
  // ====

});
