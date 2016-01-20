var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 8887
var ps = require('ps-node');
var exec = require('child_process').exec;

var Firebase = require('firebase');
var url = 'https://aircellar.firebaseio.com/temp'
var firebaseRef = new Firebase(url);

function puts(error, stdout, stderr) { console.log(stdout) }


app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)
console.log("started:", Date());

var wss = new WebSocketServer({server: server})
console.log("websocket server created");

restartOF();


wss.on("connection", function(ws) {
  var tags = {};
  ws.on("message", function(list) {
  
     var v = list.replace(/\'/g, '"');
     v = v.replace('tags', '"tags"');
     
     var p = JSON.parse(v);
     console.log('BLOCK RECEIVED', Date());
     
     for (var i in p.tags) {

      if(tags[p.tags[i]] == null) tags[p.tags[i]] = {}
      tags[p.tags[i]].timestamp = Date.now()
     }
     firebaseRef.set(tags)
     console.log('---------------');

  })

  console.log("websocket connection open");

  ws.on("close", function() {
    restartOF();
    console.log("websocket connection close")
   
  })
})


function restartOF(){
  // A simple pid lookup
  ps.lookup({
      command: './SkyeTek',
      psargs: 'ux'
      }, function(err, resultList ) {
      if (err) {
          throw new Error( err );
      }
      if(resultList.length == 0) {
        run();
      }
      resultList.forEach(function( process ){
          if( process ){
              console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
              kill(process.pid);
          }
      });
  });
}



function kill(pid) {
  // A simple pid lookup
  ps.kill( pid, function( err ) {
      if (err) {
          throw new Error( err );
      }
      else {
          console.log( 'Process %s has been killed!', pid );
          run();
      }
  });
}

function run() {
  console.log('Running openFrameworks again');
  exec("cd ~/openFrameworks/apps/myApps/SkyeTek/ && make run", puts);
}

