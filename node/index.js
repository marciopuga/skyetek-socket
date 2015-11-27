

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');

var client = new net.Socket();
  client.connect(8888, 'localhost', function() {
  console.log('Connected');
  client.write('Hello, server! Love, Client.');
  setInterval(ping,100);
});

client.on('data', function(data) {
  console.log('Received: ' + data);
  // client.destroy(); // kill client after server's response
});

client.on('close', function() {
  console.log('Connection closed');
});


function ping() {
  console.log('trying to ping');
  client.write('Hello '+ new Date());
}