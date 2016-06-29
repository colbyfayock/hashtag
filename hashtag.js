var Promise = require('bluebird');
var express = require('express');
var app     = express();
var CronJob = require('cron').CronJob;
var fs      = require('fs');
var Twitter = require('./lib/twitter.js');
var Instagram = require('./lib/instagram.js');


// Instagram Authorization Flow

app.get('/authorize_user', Instagram.authorize_user);
app.get('/handle_authorization', Instagram.handle_authorization);


// Let's get hashtag content

var get_hashtag = function(hashtag) {

    console.log('# Starting hashtag');

    return new Promise(function(resolve, reject) {
        resolve(hashtag);
    });

}


// Set up cron to run fetch every so often

new CronJob('*/10 * * * * *', function() {

    get_hashtag('meaninglesstweettotestsomestuff').then(function(hashtag) {

        return new Promise(function(resolve, reject) {

            console.log('# Getting hashtags from Twitter');

            Twitter.get_tweets({
                q: '#' + hashtag,
                result_type: 'recent'
            }, function(data) {
                console.log('## Success!');
                resolve({
                    hashtag: hashtag,
                    posts: Twitter.format_tweets(data.statuses)
                });
            });

        });

    }).then(function(promise_data) {

        return new Promise(function(resolve, reject) {

            console.log('# Getting hashtags from Instagram');

            Instagram.get_grams({
                hashtag: promise_data.hashtag
            }, function(data) {

                console.log('## Success!');

                Array.prototype.push.apply(promise_data.posts, Instagram.format_grams(data));

                resolve({
                    hashtag: promise_data.hashtag,
                    posts: promise_data.posts
                });

            });

        });

    }).then(function(promise_data) {

        console.log('# Woot! Hashtags got.');

        var output_location = './output/hashtag.json';

        fs.writeFile(output_location, JSON.stringify(promise_data, null, 4), function(errors){
            console.log('## Output placed in ' + output_location);
            console.log('##############################');
        });

    });

}, null, true, 'America/New_York');


app.listen('8081')
console.log('##############################');
console.log('# Listening on port 8081');
console.log('##############################');
exports = module.exports = app;