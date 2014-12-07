angular.module('starter.controllers', ['uiGmapgoogle-maps','ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
     $scope.d = 10000;
   
})


.controller('MapCtrl', function($scope,uiGmapGoogleMapApi,$cordovaGeolocation,$http,$ionicLoading) {
  uiGmapGoogleMapApi.then(function(maps) {
    $scope.d = 10000;
    $scope.item = "";
    $scope.markers = [];
    $scope.visible = false;
    $scope.myPos = {};
    $scope.myPos.id = 1;
    $scope.myPos.coord = {};
      $scope.map = { 
        center: { 
          latitude: 45, 
          longitude: -73 
        }, 
        zoom: 12,
        options:{disableDefaultUI  :true
          }  
        };     
      $cordovaGeolocation.getCurrentPosition().then(function (position) {
          $scope.myPos.coord.latitude = $scope.map.center.latitude  = position.coords.latitude;
          $scope.myPos.coord.longitude = $scope.map.center.longitude = position.coords.longitude;
           $scope.myPos.icon = "img/location.png";
        }, function(err) {});
      
      $scope.reanudar = function(){
        $scope.markers = [];
        $scope.visible = false;
         $scope.item = "";
      }

      $scope.rangeChange = function(d){
         $scope.d = parseInt(d);
     }

      $scope.buscaTiendas = function(item){
          
          $scope.visible = true;
          console.log("Buscando tiendas")

          $ionicLoading.show({
            template: 'Buscando...'
          });
  
        $http.get('http://10.0.0.31:9000/api/places?qname='+item+'&lat='+$scope.myPos.coord.latitude+'&lon='+
          $scope.myPos.coord.longitude+'&dis='+$scope.d).
          success(function(data, status, headers, config) {
              $scope.markers = data;
              $scope.markers.forEach( function (marker){
                marker.show = false;
                marker.onClick = function (e,m,f){
                  m.show = true;
                  $scope.map.center.latitude  = f.latitude;
                  $scope.map.center.longitude = f.longitude;
                //  console.log(f);
                }
              });
            
              $ionicLoading.hide();
              
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
          if($scope.item==""){
            $scope.item = "Todos los negocios";
        }

      }

      $scope.salirBuscar = function(){
        console.log("Salirbuscador")
        $scope.item = "";
      }
      $scope.centrar = function(){
         $cordovaGeolocation.getCurrentPosition().then(function (position) {
          $scope.myPos.coord.latitude = $scope.map.center.latitude  = position.coords.latitude;
          $scope.myPos.coord.longitude = $scope.map.center.longitude = position.coords.longitude;
        }, function(err) {});
      }
    });

})

