var request = require('request');

var header = require('./gitAPIHeaders');
// language API
var language = require('./language');

var repository = function() {
  this.getUserRepositories = (user_repos_endpoint) => {
    // console.log('getUserRepositories');
    return new Promise((resolve, reject) => {
      request.get(user_repos_endpoint, header.options, (error, response, body) => {
        body = JSON.parse(body);
        resolve(body);
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
}

var self = module.exports = exports = new repository();
