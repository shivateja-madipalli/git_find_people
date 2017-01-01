var _ = require('lodash');


var language_matches = [];
var LANGUAGE_POOL = null;

var language = function() {

  this.match_language = (user_repos, languagePool) => {
    return new Promise((resolve, reject) => {
      LANGUAGE_POOL = languagePool;
      self.createLanguagesWithInitialCount();
      // console.log('match_language');
      _.forEach(user_repos, (repo) => {
        let repo_prominent_lang = _.get(repo, 'language');
        var lower_repo_prominent_lang = self.changeToLowerCase(repo_prominent_lang);
        if(_.indexOf(languagePool, lower_repo_prominent_lang) !== -1) {
          // console.log("LANGUAGES MATCHED", self.changeToLowerCase(repo_prominent_lang));
          self.languageMatchIncrementor(lower_repo_prominent_lang);
        }
      });
      resolve(language_matches);
    });
  }

  this.languageMatchIncrementor = (language) => {
    // console.log('languageMatchIncrementor');
    let matchedLangObj =  _.find(language_matches, {'language' : language});
    if(matchedLangObj)
    matchedLangObj['count'] = matchedLangObj['count'] + 1;
  }

  this.languageMatchesJSONCreator = (language, count) => {
    // console.log('languageMatchesJSONCreator');
    var temp_lang = {
      language: language,
      count: count
    }
    // var temp_lang = null;
    language_matches.push(temp_lang);
  }

  this.createLanguagesWithInitialCount = () => {
    // Creating languages in language_matches with 0 count
    // console.log(LANGUAGE_POOL);
    language_matches = [];
    _.forEach(LANGUAGE_POOL, function(lang) {
      self.languageMatchesJSONCreator(lang, 0);
    });
  }

  this.changeToLowerCase = (input) => {
    // console.log('changeToLowerCase');
    var inputResponse = null;
    if(input) {
      if(_.isArray(input)) {
        inputResponse = [];
        _.forEach(input, function(inputVal) {
          inputResponse.push(inputVal.toLowerCase());
        });
      }
      else {
        inputResponse = input.toLowerCase();
      }
    }
    // console.log(inputResponse);
    return inputResponse;
  }

}

var self = module.exports = exports = new language();
