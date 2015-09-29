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
    var users = [];

    socket.on('auth:user', function(name){
        if(users.indexOf(name) > -1) {
            return socket.emit('auth:invalid');
        }
        user = name;
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
            io.sockets.emit('user:disconnect', user);
            console.log('- '.red+'User `'+name+'` (client '+socket.id+') disconnected');
        });

        socket.on('auth:admin', function(password){
            if(admin != "") {
                socket.emit('auth:invalid');
            }
            if(password != config.password) {
                socket.emit('auth:invalid');
                return;
            }
            console.log('+ '.green+'Admin '+socket.id+' authenticated');
            admin = socket.id;

            socket.on('section:disable', function (section) {
                io.sockets.emit('section:disable', section);
            });

            socket.on('section:enable', function (section) {
                io.sockets.emit('section:enable', section);
            });

            socket.on('about:text', function (text) {
                io.sockets.emit('about:text', text);
            });

            socket.on('about:background', function (text) {
                io.sockets.emit('about:background', text);
            });

            socket.on('chat:send', function (message) {
                var isAdmin = (socket.id == admin);
                io.sockets.emit('chat:message', {
                    message: message,
                    user: user,
                    admin: isAdmin,
                    time: Date.now()
                });
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
