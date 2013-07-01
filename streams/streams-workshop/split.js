var through = require('through');
var split = require('split');
process.stdin
    .pipe(split())
    .pipe(through(function (line) {
        console.dir(line.toString());
    }))
;

