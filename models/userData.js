var mongoose = require('mongoose');
var schema = mongoose.Schema;

// var language_count = require('./languageCount');

var language_count = new schema({
  language: String,
  count: Number
});

var userData = new schema({
  name: String,
  user_html_endpoint: String,
  user_avatar_url: String,
  language_counts: [language_count],
  rank: Number
});

module.exports = mongoose.model("userData", userData);
