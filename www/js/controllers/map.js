(function() {

  'use strict';

  angular
    .module('starter.controllers')
    .controller('GeoCtrl', Geo);

    Geo.$inject = ['$scope', '$cordovaGeolocation', 'GardenApi', '$ionicLoading', '$ionicModal', '$log'];

    function Geo($scope, $cordovaGeolocation, GardenApi, $ionicLoading, $ionicModal, $log) {
      /* jshint validthis: true */
      var vm = this;

      showMap();

      vm.initialize = _initialize;
      vm.addMarkers = _addMarkers;
      vm.getMarkersByApi = _getMarkersByApi;
      vm.showModal = _showModal;
      vm.backMyLocation = _backMyLocation;
      vm.showAllMarkers = _showAllMarkers;

      // executando as funções
      $scope.$on('map_ok', vm.getMarkersByApi);
      $scope.$on('pins_ok', vm.addMarkers);
      $scope.$on('marker_click', vm.showModal);


      // ====

      function showMap() {
        showLoading()

        var posOptions, coords;

        posOptions = {
          timeout: 10000,
          enableHighAccuracy: false
        };

        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {

          coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          $scope.user_location = coords;

          vm.initialize(coords);
        }, function(err) { console.warn(err) });
      }

      function _initialize(args) {
        var ls_position, userPosition, map, userMarker, userRadius, styles, styledMap;

        userPosition = new google.maps.LatLng(args.lat, args.lng);

        map = new google.maps.Map(document.getElementById('map-primary'), {
          center: userPosition,
          zoom: 15,
          panControl: false,
          streetViewControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scrollwheel: true,
          draggable: true,
          zIndex: 100,
          clickable: true,
          title: 'Você está aqui',
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
          animation: google.maps.Animation.DROP,
          icon: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-32.png'
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
        $scope.userMarker = userMarker;

        $scope.$emit('map_ok');

        hideLoading();

        // Eventos
        // carrega mais marcadores
        // google.maps.event.addListener(map, 'dragend', _showMarkers);
      }

      function _addMarkers() {
        var arrayMarkers, infoWindow, marker;

        arrayMarkers = [];

        $scope.infowindow = new google.maps.InfoWindow();

        arrayMarkers = $scope.all_arr;

        $scope.mapsMarkers = [];

        // console.warn('arrayMarkers', arrayMarkers);

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
      }

      function _checkIcon(type) {
        if (type === 'garden') {
          return 'img/hortas.png';
        } else {
          return 'img/feiras.png';
        }
      }

      function _getMarkersByApi() {
        return markers().then(function() {
        });
      }

      function markers() {
        var arr_gardens, arr_markets, all_arr, params,
            gardens, markets;

        arr_gardens = [];
        arr_markets = [];

        params = $scope.user_location;

        // console.warn('user_location', params);

        return GardenApi.getAll().then(function(result) {
            console.warn('result', result);

            gardens = result.gardens;
            markets = result.markets;

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
                  // address: 'Av cruz de rebouças, 1222, TIJIPIÓ - PE'
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
        }, function(err) {
          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        });
      }

      function _showMarkers() {
        var bounds, south, south_lat, south_lng, north,
        north_lat, north_lng, center_lat, center_lng,
        marker, latLng, map, params, arr_gardens,
        arr_markets, all_arr, gardens, markets;

        map = $scope.map;

        arr_gardens = [];
        arr_markets = [];

        bounds = map.getBounds();

        // south = map.getBounds().getSouthWest();
        south_lat = map.getBounds().getSouthWest().lat();
        south_lng = map.getBounds().getSouthWest().lng();

        // north = map.getBounds().getNorthEast();
        north_lat = map.getBounds().getNorthEast().lat();
        north_lng = map.getBounds().getNorthEast().lng();

        center_lat = (south_lat + north_lat) / 2;
        center_lng = (south_lng + north_lng) / 2;

        latLng = {
          'lat': center_lat,
          'lng': center_lng
        };

        params = latLng;

        // console.warn('params', params);
        $scope.all_arr = '';

        return GardenApi.getByLatLng(params).then(function(result) {
            // console.warn('result', result);

            gardens = result.gardens;
            markets = result.markets;

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
                  // address: 'Av cruz de rebouças, 1222, TIJIPIÓ - PE'
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
        }, function(err) {
          if (err === 401) { console.log('não tem permissão') }
          else {$log.warn('status error: ', err)}
        });
      }

      function showLoading() {
        $ionicLoading.show({
          template: 'Carregando mapa ...'
        }).then(function(){
         console.log("The loading indicator is now displayed");
       });
      }

      function hideLoading() {
        $ionicLoading.hide().then(function(){
         console.log("The loading indicator is now hidden");
       });
      }

      function showModal() {
        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };
      }

      function _showModal(marker, i) {
        vm.modal_marker = i.marker.data;

        // console.log(vm.modal_marker);

        // exibe o modal para as hortas
        if (vm.modal_marker.type === 'garden') {
          $ionicModal.fromTemplateUrl('templates/modals/map-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        } else {
          return;
        }
      }

      function _backMyLocation() {
        $scope.infowindow.close();

        $scope.map.setZoom(14);
        $scope.map.setCenter($scope.userMarker.getPosition());
      }

      function _showAllMarkers() {
        $scope.map.fitBounds($scope.bounds);
      }

    }

})();
