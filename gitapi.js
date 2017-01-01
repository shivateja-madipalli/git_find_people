var GIT_CONFIG = require('./git_config');
var request = require('request');
var _ = require('lodash');

// Models
var userData = require('./models/userData');
// var language_count = require('./models/languageCount');

// var options = {
//   headers: {
//     'User-Agent': 'git_find_people',
//     'Authorization': 'token 60a302afbfa435ca0d4245a3dbc76b18254b15ba'
//   }
// };

// Headers
var header = require('./gitAPIHeaders');

// var options = {
//   headers: {
//     'User-Agent': 'git_find_people',
//     'Authorization': 'token 60a302afbfa435ca0d4245a3dbc76b18254b15ba'
//   }
// };

// repository API
var repository = require('./repository');

// language API
var language = require('./language');

var SUPPORTING_LANGUAGES = null;
var MAIN_LANGUAGE = null;
var LANGUAGE_POOL = null;
let language_matches = [];

// let userData = [];

let gitAPI = function() { // this is the closure function

  this.getRepos = (main_language, supporting_languages) => {
    SUPPORTING_LANGUAGES = supporting_languages;
    MAIN_LANGUAGE = main_language;
    LANGUAGE_POOL = SUPPORTING_LANGUAGES;
    LANGUAGE_POOL.push(MAIN_LANGUAGE);

    LANGUAGE_POOL = language.changeToLowerCase(LANGUAGE_POOL);

    console.log('!@#$%^&');
    console.log(LANGUAGE_POOL);
    console.log('!@#$%^&');

    return new Promise((resolve, reject) => {
      let git_search_api =  GIT_CONFIG.search_repos_api + "?q=language:" + main_language + "&sort=pushed&per_page=100";
      // let git_search_api =  GIT_CONFIG.search_repos_api + "?q=language:" + main_language;
      request.get(git_search_api, header.options, (error, response, body) => {
        body = JSON.parse(body);
        let filteredData = _.filter(body.items, ['owner.type', 'User']);

        _.forEach(filteredData, (repo) => {
          let user_repo_endpoint = _.get(repo, 'owner.repos_url');
          let user_html_url = _.get(repo, 'owner.html_url');
          let user_login_name = _.get(repo, 'owner.login');
          let user_avatar_url = _.get(repo, 'owner.avatar_url');
          repository.getUserRepositories(user_repo_endpoint).then((res) => {

            language.match_language(res, LANGUAGE_POOL).then((languageMatches) => {
              // creating json
              var userDetails = new userData({
                name: user_login_name,
                user_html_endpoint: user_html_url,
                user_avatar_url: user_avatar_url,
                language_counts: languageMatches,
                rank: 0
              });
              // userData.push(userDetails);
              console.log('FINAL INDI USER DETAILS: ', userDetails);
              resolve(filteredData);
            }).catch((err) => {
              console.log("error at getUserRepositories");
            });
          }).catch((err) => {
            console.log("error at user_repo_endpoint");
          });
        });
      }).on('error', (err) => {
        reject(err);
      });

    });
  };

  // this.getUserRepos = (user_repos_endpoint) => {
  //   return new Promise((resolve, reject) => {
  //     request.get(user_repos_endpoint, options, (error, response, body) => {
  //       body = JSON.parse(body);
  //       self.match_language(body);
  //       resolve();
  //     }).on('error', (err) => {
  //       reject(err);
  //     });
  //   });
  // }
  //
  // this.match_language = (user_repos) => {
  //   self.createLanguagesWithInitialCount();
  //   _.forEach(user_repos, (repo) => {
  //     let repo_prominent_lang = _.get(repo, 'language');
  //     var lower_repo_prominent_lang = self.changeToLowerCase(repo_prominent_lang);
  //     if(_.indexOf(LANGUAGE_POOL, lower_repo_prominent_lang) !== -1) {
  //       // console.log("LANGUAGES MATCHED", self.changeToLowerCase(repo_prominent_lang)));
  //       self.languageMatchIncrementor(lower_repo_prominent_lang);
  //     }
  //   });
  // }
  //
  // this.languageMatchIncrementor = (language) => {
  //   let matchedLangObj =  _.find(language_matches, {'language' : language});
  //   if(matchedLangObj)
  //       matchedLangObj['count'] = matchedLangObj['count'] + 1;
  // }
  //
  // this.languageMatchesJSONCreator = (language, count) => {
  //   var temp_lang = {
  //     language: language,
  //     count: count
  //   }
  //   // var temp_lang = null;
  //   language_matches.push(temp_lang);
  // }
  //
  // this.createLanguagesWithInitialCount = () => {
  //   // Creating languages in language_matches with 0 count
  //   language_matches = [];
  //   _.forEach(LANGUAGE_POOL, function(lang) {
  //     self.languageMatchesJSONCreator(lang, 0);
  //   });
  // }
  //
  // this.changeToLowerCase = (input) => {
  //   var inputResponse = null;
  //   if(input) {
  //     if(_.isArray(input)) {
  //       inputResponse = [];
  //       _.forEach(input, function(inputVal) {
  //         inputResponse.push(inputVal.toLowerCase());
  //       });
  //     }
  //     else {
  //       inputResponse = input.toLowerCase();
  //     }
  //   }
  //   // console.log(inputResponse);
  //   return inputResponse;
  // }

}

/*
The three functions getRepos, getUserRepos and find_language_match
are like the functions inside the class gitAPI class
*/

exports.LANGUAGE_POOL = LANGUAGE_POOL;
var self = module.exports = new gitAPI();
