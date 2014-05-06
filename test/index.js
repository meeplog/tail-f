Tailer = require('../')


// test if globul is a array of string
tailerw = new Tailer({
    pattern: ['/tmp/logs/*.log', '/tmp/pids/*.pid']
})