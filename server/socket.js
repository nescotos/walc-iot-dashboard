module.exports = function(socket){

    socket.on('join:sensor', function(userData){
      var clientId = userData.clientId;
      console.log(clientId, 'connected')
      socket.join(clientId);
    });

    socket.on('disconnect', function(clientId){
      socket.leave(clientId);
    });
    //
    // socket.on('send:notification', function(notification){
    //   console.log('Sending notification to', notification.notification.userNameReceiver);
    //   socket.in(notification.notification.userNameReceiver).emit('notification', notification.notification);
    // });
}
