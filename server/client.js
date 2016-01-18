var WebSocket = require('ws');
var ws = new WebSocket('http://192.168.1.34:8887');

ws.on('open', function open() {
  ws.send('we are connected');
});

ws.on('message', function(data, flags) {
  console.log(data)
});