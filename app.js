var express = require('express');
var app = express();
var http = require('http').Server(app);
var config = require('./config.json');

require('./socket.js')(http);

app.use(express.static('public'));

http.listen(config.port, function(){
    console.log('listening on port '+config.port);
});
