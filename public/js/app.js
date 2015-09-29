var app = angular.module('socketApp', ['ngCookies', 'btford.socket-io', 'pascalprecht.translate']);

app.factory('socket', function (socketFactory) {
    return socketFactory({
        ioSocket: io.connect()
    });
});

app.controller('mainController', function($scope, $window, socket, $translate, $cookies, $anchorScroll) {
    $scope.sections = {
        about: false,
        chat: false
    }
    $scope.admin = false;
    $scope.users = [];
    var clickCount = 0;

    socket.on('connect', function () {
        var name;
        if(!$cookies.get('name')) {
            console.debug('Name not found in cookie storage, asking new one..');
            name = prompt('What is your name?')
            if(!name) {
                return $window.location.reload();
            }
            console.debug('Name received, storing name in cookie storage..');
            $cookies.put('name', name);
        } else {
            name = $cookies.get('name');
            console.debug('Name '+name+' found, proceed from cookie storage..');
        }
        console.debug('Authenticating..');
        socket.emit('auth:user', name);
        console.debug('Showing page content..');
        $scope.name = name;
        $scope.showPage = true;

        socket.on('auth:invalid', function () {
            return $window.location.reload();
        });

        socket.on('user:current', function (users) {
            console.debug('List of current users gain: '+ users);
            $scope.users = users;
        });

        socket.on('user:connect', function (user) {
            console.debug('New user joined: '+ user);
            $scope.users.push(user);
        });

        socket.on('user:disconnect', function (user) {
            console.debug('User disconnect: '+ user);
            $scope.users.splice($scope.users.indexOf('name'), 1);
        });

        socket.on('section:enable', function (section) {
            $scope.sections[section] = true;
            console.debug('Section `'+section+'` enabled.');
            $anchorScroll(section+'Section');
        });

        socket.on('section:disable', function (section) {
            $scope.sections[section] = false;
            console.debug('Section `'+section+'` disabled.');
        });
    });

    $scope.changeLanguage = function (key) {
        $translate.use(key);
        $translate.use('NL_nl');
    };

    $scope.askAdmin = function () {
        if(clickCount < 5) {
            return clickCount++;
        }
        var password = prompt('password');
        socket.emit('auth:admin', password);
        $scope.admin = true;
        console.debug('Admin rights gain.');
    }

    $scope.updateSection = function (section) {
        if ($scope.sectionUpdateValue[section] == true) {
            socket.emit('section:enable', section);
        } else {
            socket.emit('section:disable', section);
        }
    }
});

app.controller('aboutController', function($scope, socket) {
    socket.on('about:text', function (text) {
        console.debug('(About) text changed to '+text);
        $scope.textContent = text;
    });

    socket.on('about:background', function (color) {
        console.debug('(About) Background set to: '+color);
        $("body").css('background-color', color);
    })

    $scope.updateText = function () {
        socket.emit('about:text', $scope.textField);
    }

    $scope.setBackground = function () {
        socket.emit('about:background', $scope.backgroundColor);
    }
});

app.controller('chatController', function($scope, socket) {
    $scope.chatMessages = [];

    socket.on('chat:message', function (data) {
        console.debug('(Chat) Chat message received: '+data.message);
        $scope.chatMessages.push(data);
    });

    $scope.sendMessage = function () {
        if(!$scope.chatMessage || typeof $scope.chatMessage == "undefined") {
            return;
        }
        socket.emit('chat:send', $scope.chatMessage);
    }
});
