var Gaze = require('gaze').Gaze,
    utils = require(__dirname + '/utils'),
    fs = require('graceful-fs');

function Tailer(options) {

    var self = this;
    options = options || {};
    this.pattern = options.pattern;
    this.ws = options.ws || process.stdout;


    this.fileStats = {};

    // check if the pattern is a string or an array
    if (!utils.isGlob(this.pattern)) {
        return;
    }
    this.gaze = new Gaze(this.pattern);

    this.files = utils.flattenPathObject(this.gaze.watched());

    this.getSizes(this.files);

    console.log(this.fileStats)

    // process file change events
    this.gaze.on('changed', fileHandler);

    function fileHandler(filepath) {

        setImmediate(self.fileChangeHandler(filepath));
    }


}

module.exports = Tailer;


// handle file update events 
Tailer.prototype.fileChangeHandler = function fileChangeHandler(filepath) {

    var self = this;


    var cl = function cl(err, size) {

        var options = {
            readFrom: 0,
            readTo: 0,
            file: ''
        }
        options.readFrom = self.fileStats[filepath];
        options.readTo = size;
        options.file = filepath;
        self.fileStats[filepath] = size;

        self.reader(options).pipe(fs.createWriteStream('/tmp/t.log', {
            flags: 'a'
        }));


    };

    self.getSize(filepath, cl)



}


// generate 
Tailer.prototype.getSizes = function getSizes(files, cb) {

    var self = this;

    files.forEach(gs);

    function gs(file) {
        self.fileStats[file] = self.getSizeSync(file);
    }

};



// get the size of a single file 
Tailer.prototype.getSizeSync = function getSizeSync(file) {

    var stat = fs.statSync(file);

    return stat.size;

}

// get the size of a single file 
Tailer.prototype.getSize = function getSize(file, cb) {

    fs.stat(file, gs);

    function gs(err, stat) {
        if (err) return cb(err, null);
        cb(null, stat.size);
    }

}

Tailer.prototype.reader = function reader(data) {

    var rs = fs.createReadStream(data.file, {
        start: data.readFrom,
        end: data.readTo

    })
    return rs;

}

Tailer.prototype.close = function close() {

    var self = this;

    this.gaze.close()
}