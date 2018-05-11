var fs = require('fs');
var exec = require('child_process').exec;
var debounce = null;

fs.watch('./styles', function(event, filename){
  if(!debounce) {
    console.log("Less changed. Rebuilding.");
    exec('bash build-less.sh', function(err, stdout, stderr){
        if(err){
          console.log(err);
          return;
        }
        console.log("Less rebuilt.");
      });
      debounce = setTimeout(function(){ debounce = null }, 500);
  }
});