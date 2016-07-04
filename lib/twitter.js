var Twitter = require('twitter');
var ConfigTwitter = require('../config/config-twitter');

exports.get_tweets = function(params, callback) {

    if ( typeof params === 'undefined' ) {
        console.log('Oops, you haven\'t defined any parameters!');
        return;
    }

    if (
        !ConfigTwitter
        || !ConfigTwitter.consumer_key
        || !ConfigTwitter.consumer_secret
        || !ConfigTwitter.access_token_key
        || !ConfigTwitter.access_token_secret
    ) {
        console.log('Oops, you\'re missing Twitter keys');
        return;
    }

    var client = new Twitter({
        consumer_key: ConfigTwitter.consumer_key,
        consumer_secret: ConfigTwitter.consumer_secret,
        access_token_key: ConfigTwitter.access_token_key,
        access_token_secret: ConfigTwitter.access_token_secret
    });

    client.get('search/tweets', params, function(error, data, response) {

        if ( error ) {
            console.log('Error! Twitter. Terminate!', error);
            return;
        }

        if ( typeof callback !== 'undefined' ) {
            callback(data);
        }
        
    });

};

exports.format_tweets = function(statuses) {

	var results = [];

    for ( var i = 0, tweets_len = statuses.length; i < tweets_len; i++ ) {

        var media = [];

        if ( statuses[i].entities.media ) {

            for ( var j = 0, media_len = statuses[i].entities.media.length; j < media_len; j++ ) {
                media.push({
                    id: statuses[i].entities.media[j].id,
                    media_url: statuses[i].entities.media[j].media_url
                });
            }

        }

        results.push({
            screen_name: statuses[i].user.screen_name,
            text: statuses[i].text,
            media: media.length > 0 ? media : false,
            source: 'twitter',
            created_at: parseInt(new Date(statuses[i].created_at).getTime())
        });

    }

    return results;

}