var GIT_CONFIG = require('./git_config');
var request = require('request');
var _ = require('lodash');

// Headers
var header = require('./gitAPIHeaders');

let gitAPI = function() { // this is the closure function

  this.getRepos = (main_language, supporting_languages) => {
    console.log('getRepos');
      return new Promise((resolve, reject) => {
      let git_search_api =  GIT_CONFIG.search_repos_api + "?q=language:" + main_language + "&sort=pushed&per_page=100";
      request.get(git_search_api, header.options, (error, response, body) => {
        body = JSON.parse(body);
        let filteredData = _.filter(body.items, ['owner.type', 'User']);
        let git_search_api2 =  "https://api.github.com/search/repositories?q=language:"+main_language+"&sort=pushed&per_page=100&page=2";
        request.get(git_search_api2, header.options, (error, response, body1) => {
          body1 = JSON.parse(body1);
          let filteredData1 = _.filter(body1.items, ['owner.type', 'User']);
          filteredData = filteredData.concat(filteredData1);
          resolve(filteredData);
        });
      }).on('error', (err) => {
        reject(err);
      });

    });
  };
};

var self = module.exports = new gitAPI();
