var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/www'));

var devices = {};

function broadcastDevices(socket) {
  var ids = [];
  for (var id in devices) {
    ids.push({id: id, name: id});
  }
  socket.broadcast.emit('devices', ids);
  socket.emit('devices', ids);
}

io.on('connection', function(socket) {
  devices[socket.id] = socket;

  socket.emit('id', socket.id);
  broadcastDevices(socket);
  socket.on('message', function(to, payload) {
    var destination = devices[to];
    if (destination != undefined) {
	destination.emit('message', socket.id, payload);
    } else {
	console.log(socket.id + ': ' +JSON.stringify(payload));
    }
  });

  socket.on('disconnect', function () {
    delete devices[socket.id];
    broadcastDevices(socket);
  });
});
