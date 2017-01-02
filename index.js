var express = require('express'); // Node framework
var app = express(); // creating express app
var bodyParser = require('body-parser'); // body parser is for parsing body content in post request
var Promise = require('promise');
var gitAPI = require('./gitapi');
var _ = require('lodash');

// repository API
var repository = require('./repository');

// language API
var language = require('./language');

// Rank
var rank = require('./rank');

const PORT = 1234;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var SUPPORTING_LANGUAGES = null;
var MAIN_LANGUAGE = null;
var LANGUAGE_POOL = null;
let language_matches = [];

let userData = [];

app.post('/fetchpeople', function(req, res) {
  let main_language = req.body.main_language;
  let supporting_languages = req.body.supporting_languages;

  SUPPORTING_LANGUAGES = supporting_languages;
  MAIN_LANGUAGE = main_language;
  LANGUAGE_POOL = SUPPORTING_LANGUAGES;
  LANGUAGE_POOL.push(MAIN_LANGUAGE);
  LANGUAGE_POOL = language.changeToLowerCase(LANGUAGE_POOL);

  gitAPI.getRepos(main_language, supporting_languages).then((filteredData) => {
    return repository.getUserRepositories(filteredData, LANGUAGE_POOL);

  }).then((result) => {
    var FINALLIST = rank.calculateRank(result, MAIN_LANGUAGE, SUPPORTING_LANGUAGES);
    console.log('FINALLIST', FINALLIST);
    // res.status('200').send(FINALLIST);
    res.json(FINALLIST);
    // res.status('400');

  }).catch((err) => {
    res.status('400');
  });
});

app.listen(PORT, function () {
  console.log('Example app listening on port ', PORT);
});
