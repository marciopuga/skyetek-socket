

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');
var clockId = 0;
var client = new net.Socket();
  client.connect(8888, '192.168.1.64', function() {
  console.log('Connected');
  clockId = setInterval(clock, 1000);
  client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
  onData(data);
  // client.destroy(); // kill client after server's response
});

client.on('error', function(err) {
  console.log('Error', err);
  clearInterval(clockId);
} )

client.on('close', function() {
  console.log('Connection closed');
});


function onData(data) {
  var list = data.toString().split("\n");
  for (i in list) {
    if(list[i]) update(list[i])
  }
}

function update(tag) {
  for (var i = 0; i < bottles.length; i++) {
    if(bottles[i].rfid == tag.trim()){
      bottles[i].last_seen = Date.now();
    }
  };
}

function clock() {
  console.log('Clock ticking', bottles)
  var diff;
  for (var i = 0; i < bottles.length; i++) {
    
    diff = Date.now() - bottles[i].last_seen
    if(diff > 2000){
      console.log("-----------------Bottle", bottles[i].name, " WAS REMOVED");
    }else {
      console.log("Bottle", bottles[i].name, "IN THE CELLAR");
    }
  };
}




var bottles = [
  {'name': '000', rfid: '000000000000000000000000', last_seen:0},
  {'name': '001', rfid: '000000000000000000000001', last_seen:0},
  {'name': '002', rfid: '000000000000000000000002', last_seen:0},
  {'name': '003', rfid: '000000000000000000000003', last_seen:0},
  {'name': '004', rfid: '000000000000000000000004', last_seen:0},
  {'name': '005', rfid: '000000000000000000000005', last_seen:0}
]
