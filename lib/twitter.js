var Twitter = require('twitter');

exports.get_tweets = function(params, callback) {

    if ( typeof params === 'undefined' ) {
        console.log('Oops, you haven\'t defined any parameters!');
        return;
    }

    var tweets;
    var client = new Twitter({
        consumer_key: '',
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: 'H'
    });

    client.get('search/tweets', params, function(error, data, response) {

        if ( error ) {
            console.log('Error! Terminate!', error);
            return;
        }

        if ( typeof callback !== 'undefined' ) {
            callback(data);
        }
        
    });

};