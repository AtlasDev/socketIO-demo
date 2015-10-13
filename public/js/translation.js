app.config(function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');
    $translateProvider.preferredLanguage('EN_us');
    $translateProvider.usePostCompiling(true);
    $translateProvider.translations('EN_us', {
        common: {
            online: 'Online users:'
        },
        header: {
            title: 'Socket.IO demo',
            credits: 'Created by',
            language: 'Choose language',
            hello: 'Welcome {{name}}!',
            description: 'What you will see in a few moments is a demo of the most cutting-edge technology from the web development department. This technology is used in chat applications like Facebook Chat, live stream services like WatchBeam or even in your mailservice Gmail. The presentation will start in a few moments, so sit back and relax till everyone has joined the website.'
        },
        example: {
            title: 'examples with Socket.IO.',
            description: 'Some small example of the posiblilties of Socket.IO.',
            color: {
                white: 'White',
                red: 'Red',
                green: 'Green',
                blue: 'Blue',
                black: 'Black'
            }
        },
        chat: {
            title: 'More examples',
            box: 'Chat box',
            message: 'Message'
        },
        what: {
            title: 'How does Socket.IO work?'
        }
    })
    .translations('NL_nl', {

    }).fallbackLanguage('EN_us');
});
