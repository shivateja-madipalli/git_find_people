var request = require('request');
var _ = require('lodash');

var header = require('./gitAPIHeaders');
var language = require('./language');


// Models
var userData = require('./models/userData');

var repository = function() {

  this.getUserRepositories = (filteredData, LANGUAGE_POOL) => {
    return new Promise((resolve, reject) => {
      var finalUserDetails = [];
      _.forEach(filteredData, (repo) => {

        let user_repo_endpoint = _.get(repo, 'owner.repos_url');
        let user_html_url = _.get(repo, 'owner.html_url');
        let user_login_name = _.get(repo, 'owner.login');
        let user_avatar_url = _.get(repo, 'owner.avatar_url');

        request.get(user_repo_endpoint, header.options, (error, response, body) => {
          body = JSON.parse(body);

          var languageMatches = language.match_language(body, LANGUAGE_POOL);
          var userDetails = new userData({
            name: user_login_name,
            user_html_endpoint: user_html_url,
            user_avatar_url: user_avatar_url,
            language_counts: languageMatches,
            rank: 0
          });

          finalUserDetails.push(userDetails);
          if(_.size(finalUserDetails) == _.size(filteredData)) {
            resolve(finalUserDetails);
          }
        }).on('error', (err) => {
          console.log('ERROR', err);
          reject(err);
        });
      });
    });
  }
}

self = module.exports = exports = new repository();
