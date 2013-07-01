var through = require('through')
  , split   = require('split');

var upper = false;

process.stdin
  .pipe(split())
  .pipe(through(function(buf) {
     var s;
     if (upper) {
       s = buf.toString().toUpperCase();
     } else {
       s = buf.toString().toLowerCase();
     }
     this.queue(s + "\n");
     upper = !upper;
   }))
  .pipe(process.stdout);
