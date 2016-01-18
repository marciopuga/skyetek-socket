var WebSocket = require('ws');
var ws = new WebSocket('ftp://aircellar.herokuapp.com');

ws.on('open', function open() {
  ws.send('we are connected');
});

ws.on('message', function(data, flags) {
  console.log(data)
});