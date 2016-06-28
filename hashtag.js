var express = require('express');
var app     = express();
var CronJob = require('cron').CronJob;
var fs      = require('fs');
var Twitter = require('./lib/twitter.js');

new CronJob('00 */10 * * * *', function() {

    var tweets = Twitter.get_tweets({
        q: '#meaninglesstweettotestsomestuff',
        result_type: 'recent'
    }, function(data) {
        var tweets = data.statuses,
            results = [],
            media = [];

        for ( var i = 0, tweets_len = tweets.length; i < tweets_len; i++ ) {

            if ( tweets[i].entities.media ) {

                for ( var j = 0, media_len = tweets[i].entities.media.length; j < media_len; j++ ) {
                    media.push({
                        id: tweets[i].entities.media[j].id,
                        media_url: tweets[i].entities.media[j].media_url
                    });
                }

            }

            results.push({
                screen_name: tweets[i].user.screen_name,
                text: tweets[i].text,
                media: media.length > 0 ? media : false
            });

        }
        console.log(results);
    });

    console.log('Looking for new tweets!');

}, null, true, 'America/New_York');

app.listen('8081')
console.log('Listening on port 8081');
exports = module.exports = app;