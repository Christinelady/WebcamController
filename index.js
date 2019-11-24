const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

//Webcamera code line1/2
const CTLCameraControl = require('./CTLCameraControl/CTLCameraControl')
const camera = new CTLCameraControl();
camera.setSpeed(10000);
camera.reset();

app.use('/static', express.static(`${__dirname}/static`));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('face_detected', function(side) {
      if (side == 0) {
        camera.turnLeft()
          .then(() => camera.delay(2000))
          .then(() => camera.reset())
          .then(() => camera.delay(1000))
          .then(() => {
            socket.emit('ready');
          });
      } else {
        camera.turnRight()
          .then(() => camera.delay(2000))
          .then(() => camera.reset())
          .then(() => camera.delay(1000))
          .then(() => {
            socket.emit('ready');
          });
      }
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
  console.log('Started web server at http://localhost:3000');
});
