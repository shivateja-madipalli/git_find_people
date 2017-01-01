var mongoose = require('mongoose');
var schema = mongoose.Schema;

var language_count = new schema({
  language: String,
  count: Number
});

module.exports = mongoose.model("languageCount", language_count);
