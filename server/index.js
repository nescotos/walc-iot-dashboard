//Import packages
var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
//Importing socket.js file
var socket = require('./socket');
//Using and Enabling CORS
app.use(cors());
//Enabling Morgan
app.use(morgan('dev'));
//Processing Sensor Request
//Starting the server
var server = app.listen(3000, function(){
  console.log('Server Started')
});
//Starting the socket
var io = require('socket.io')(server);
io.sockets.on('connection', socket);

app.post('/data', function(req, res){
  //Getting all parameters
  Object.keys(req.query).forEach(function(name){
    console.log(name, req.query[name]);
   });
   var currentDate = new Date();
   var sensorData = {temp : req.query.temp, hum : req.query.hum, hours : currentDate.getHours(), minutes: currentDate.getMinutes(), seconds: currentDate.getSeconds()};
   io.in(req.query.clientId).emit('data:new', sensorData);
   res.json({message: 'Success Request'});
});
