var app = angular.module('app', ['chart.js'])
.factory('Socket', function ($rootScope) {
  var socket = io.connect("http://localhost:3000/");
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
})
.controller('dashboardCtrl', function($scope, Socket, $http){
 Socket.emit('join:sensor', {clientId: '998855'});

 $scope.labels = [];
 $scope.series = ['Humidity', 'Temperature'];
 $scope.colors = ['#1ae800', '#fea103', '#ff8e72'];

 var humidityData = [];
 var tempData = [];

 $scope.data = [
   humidityData,
   tempData
 ];
 // Grab stored data
 $http({
  method: 'GET',
  url: 'http://localhost:3000/data/998855'
}).then(function(response){
  for(var i = 0; i < response.data.length; i++){
    humidityData.push(response.data[i].humidity);
    tempData.push(response.data[i].temperature);
    var currentDate = new Date(response.data[i].createdAt);
    $scope.labels.push(formatDate(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()));
  }
})
 // Socket Events
 //Incoming data
 Socket.on('data:new', function(data){
   cleanArray($scope.labels);
   var currentDate = new Date(data.date);
   $scope.labels.push(formatDate(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()));
   cleanArray(humidityData);
   cleanArray(tempData);
   humidityData.push(Number(data.hum));
   tempData.push(Number(data.temp));
  //  alert('Incoming Data: ' +  data.temp + data.hum);
 });

 function formatDate(hours, minutes, seconds){
   if(minutes < 10){
     minutes = "0" + minutes;
   }
   if(seconds < 10){
     seconds = "0" + seconds;
   }
   return hours + ":" + minutes + ":" + seconds;
 }

 function cleanArray(array){
   if(array.length > 20){
     array.shift();
   }
 }

 $scope.onClick = function (points, evt) {
   console.log(points, evt);
 };
 $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
 $scope.options = {
   scales: {
     yAxes: [
       {
         id: 'y-axis-1',
         type: 'linear',
         display: true,
         position: 'left'
       },
       {
         id: 'y-axis-2',
         type: 'linear',
         display: true,
         position: 'right'
       }
     ]
   }
 };
})
