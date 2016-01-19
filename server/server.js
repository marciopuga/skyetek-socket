var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 8887

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)
console.log("started:", Date());

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {

  ws.on("message", function(list) {
  
     var v = list.replace(/\'/g, '"');
     v = v.replace('tags', '"tags"');
     
     var p = JSON.parse(v);
     console.log('BLOCK RECEIVED', Date());
     for (var i in p.tags) {
      console.log(p.tags[i]);
     }
     console.log('---------------');

  })

  console.log("websocket connection open");

  ws.on("close", function() {
    console.log("websocket connection close")
   
  })
})

