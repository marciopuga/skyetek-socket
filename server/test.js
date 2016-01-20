var shell = require('shelljs');
var ps = require('ps-node');

// or more concisely
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }


// exec("subl .", puts);
// exec("ls", puts);


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

function kill(pid) {
  // A simple pid lookup
  ps.kill( pid, function( err ) {
      if (err) {
          throw new Error( err );
      }
      else {
          console.log( 'Process %s has been killed!', pid );
      }
  });
}

function run() {
  console.log('Running openFrameworks again');
  exec("cd ~/openFrameworks/apps/myApps/SkyeTek/ && make run", puts);
}