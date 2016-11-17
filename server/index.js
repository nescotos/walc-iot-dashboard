//Import packages
var express = require('express');
var app = express();
var cors = require('cors');
var morgan = require('morgan');
var mongoose = require('mongoose');
//Importing socket.js file
var socket = require('./socket');
// Import Data model
var Data = require('./data');
// Connecting to Mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/walc-iot');
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

//Getting data
app.get('/data/:clientId', function(req, res){
  var clientId = req.params.clientId;
  Data.find({clientId : clientId}).sort({'createdAt': 1}).limit(20).exec(function(err, datas){
    if(err){
      res.json({error: 'Something went wrong, try later!'});
    }else{
      res.json(datas);
    }
  })
});

app.post('/data', function(req, res){
  //Getting all parameters
  Object.keys(req.query).forEach(function(name){
    console.log(name, req.query[name]);
   });
   var currentDate = new Date();
   var sensorData = {temp : req.query.temp, hum : req.query.hum, date : currentDate};
   //Data Object
   var newData = new Data();
   newData.clientId = req.query.clientId;
   newData.temperature = sensorData.temp;
   newData.humidity = sensorData.hum;
   //Saving
   newData.save(function(err){
     if(err){
       res.json({error: 'Something went wrong, try later!'});
     }else{
       io.in(req.query.clientId).emit('data:new', sensorData);
       res.json({message: 'Success Request'});
     }
   });
});
