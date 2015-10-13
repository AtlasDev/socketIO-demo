module.exports = function (http) {

var config = require('./config.json');
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var colors = require('colors');
var admin = "";
var users = [];

io.on('connection', function(socket) {
    console.log('+ '.cyan+'Client `'+socket.id+'` connected.');
    var name;

    socket.on('auth:user', function(name){
        if(users.indexOf(name) > -1) {
            return socket.emit('auth:invalid');
        }
        name = name;
        socket.emit('user:current', users);
        io.sockets.emit('user:connect', name);
        users.push(name);
        console.log('+ '.green+'User `'+name+'` authenticated');

        socket.on('disconnect', function(){
            if(socket.id == admin) {
                admin = "";
                console.log('- '.red+'Admin `'+name+'` (client '+socket.id+') disconnected');
            }
            users.splice(users.indexOf('name'), 1);
            io.sockets.emit('user:disconnect', name);
            console.log('- '.red+'User `'+name+'` (client '+socket.id+') disconnected');
        });

        socket.on('chat:send', function (message) {
            var isAdmin = (socket.id == admin);
            io.sockets.emit('chat:message', {
                message: message,
                user: name,
                admin: isAdmin,
                time: Date.now()
            });
        });

        socket.on('auth:admin', function(password){
            if(admin != "") {
                return socket.emit('auth:invalid');
            }
            if(password != config.password) {
                return socket.emit('auth:invalid');
            }
            console.log('+ '.green+'Admin '+socket.id+' authenticated');
            admin = socket.id;
            socket.on('section:disable', function (section) {
                io.sockets.emit('section:disable', section);
            });

            socket.on('section:enable', function (section) {
                io.sockets.emit('section:enable', section);
            });

            socket.on('example:text', function (text) {
                io.sockets.emit('example:text', text);
            });

            socket.on('example:background', function (text) {
                io.sockets.emit('example:background', text);
            });
        });
    });
});


//ss(socket).on('song:play', function(stream, data) {
//    if()
//    var filename = path.basename(data.name);
//    stream.pipe(fs.createWriteStream(filename));
//});

}
