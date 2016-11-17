module.exports = function(socket){

    socket.on('join:sensor', function(userData){
      var clientId = userData.clientId;
      console.log(clientId, 'connected')
      socket.join(clientId);
    });

    socket.on('disconnect', function(clientId){
      socket.leave(clientId);
    });
}
