var async = require('async'),
    fs = require('graceful-fs');

var readStream = function readStream(task, callback) {

    var rs = fs.createReadStream(task.file, {
        start: task.readFrom,
        end: task.readTo

    })
    callback(null, rs)

}

var q = async.queue(readStream, 1);


module.exports = q;