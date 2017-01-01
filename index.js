var express = require('express'); // Node framework
var app = express(); // creating express app
var bodyParser = require('body-parser'); // body parser is for parsing body content in post request
var Promise = require('promise');
var gitAPI = require('./gitapi');

const PORT = 1234;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/fetchpeople', function(req, res) {
  let main_language = req.body.main_language;
  let supporting_languages = req.body.supporting_languages;
  gitAPI.getRepos(main_language, supporting_languages).then(function(data) {
    res.status('200').json(data);
  }).catch(function(err) {
    res.status('400');
  });
});

app.listen(PORT, function () {
  console.log('Example app listening on port ', PORT);
});
