var Instagram = require('instagram-node').instagram();
var ConfigInstagram = require('../config/config-instagram');

exports.authorize_user = function(request, response) {
    
    var redirect_uri = 'http://localhost:8081/handle_authorization';
    
    Instagram.use({
        client_id: ConfigInstagram.client_id,
        client_secret: ConfigInstagram.client_secret
    });

    response.redirect(Instagram.get_authorization_url(redirect_uri, { scope: ['public_content'] }));

};

exports.handle_authorization = function(request, response) {

    var redirect_uri = 'http://localhost:8081/handle_authorization';

    Instagram.use({
        client_id: ConfigInstagram.client_id,
        client_secret: ConfigInstagram.client_secret
    });

    Instagram.authorize_user(request.query.code, redirect_uri, function(errors, result) {

        if ( errors ) {
        	console.log('Error! Instagram auth. Terminate!', errors);
            console.log(errors.body);
            return;
        }

        console.log('Instagram auth success! Access token is ' + result.access_token);

    });

};

exports.get_grams = function(params, callback) {

    if ( typeof params === 'undefined' ) {
        console.log('Oops, you haven\'t defined any parameters!');
        return;
    }

    if ( typeof params.hashtag === 'undefined' ) {
        console.log('Uh oh, can\'t get Instagram photos without a hashtag')
    }

    if ( !ConfigInstagram || !ConfigInstagram.client_id || !ConfigInstagram.access_token ) {
        console.log('Oops, you\'re missing Instagram keys');
        return;
    }

    Instagram.use({
        client_id: ConfigInstagram.client_id,
        access_token: ConfigInstagram.access_token
    });

    Instagram.tag_media_recent(params.hashtag, function(errors, data, pagination, remaining, limit) {

        if ( errors ) {
            console.log('Error! Instagram. Terminate!', errors);
            return;
        }

        if ( typeof callback !== 'undefined' ) {
            callback(data);
        }

    });

};

exports.format_grams = function(grams) {

    var results = [];

    for ( var i = 0, grams_len = grams.length; i < grams_len; i++ ) {

        results.push({
            screen_name: grams[i].user.username,
            text: grams[i].caption.text,
            media: [{
                id: grams[i].id,
                media_url: grams[i].images.standard_resolution.url
            }],
            source: 'instagram',
            created_at: parseInt(grams[i].created_time) * 1000
        });

    }

    return results;

}