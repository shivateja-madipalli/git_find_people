var _ = require('lodash');

var rank = function() {

  this.calculateRank = (userPool, mainLanguage, subLanguages) => {
    userPool = _.orderBy(userPool, (userData) => {
      return userData.language_counts[_.size(userData.language_counts) - 1].count;
    }, ['desc']);
    // console.log(userPool[0].language_counts);

    var max_MainLanguage = userPool[0].language_counts[_.size(userPool[0].language_counts) - 1].count;

    var distinctionVal = ((max_MainLanguage/100)*70);

    // console.log('!@#$%#@#$%$#@!#$%^$#@#$%^%$#@#$%^%$#@', distinctionVal);

    var finalList = [];

    var userDatawithDistinction = [];
    var userDatawithoutDistinction = [];

    // filter pool with Main Language > 70% of max value
    var i = 1;
    _.forEach(userPool, (userData) => {
      if(userData.language_counts[_.size(userData.language_counts) - 1].count >= distinctionVal) {
        userData.rank = i;
        i++;
        userDatawithDistinction.push(userData);
      }
      else {
        userDatawithoutDistinction.push(userData);
      }
    });
    // console.log('userPool size', _.size(userPool));
    finalList = userDatawithDistinction;

    var sorteduserDatawithoutDistinction = _.orderBy(userDatawithoutDistinction, (userData) => {
      var sumOfAllSupportingLangs = 0;
      _.forEach(userData.language_counts, (languageCount) => {
        sumOfAllSupportingLangs += languageCount.count;
      });
      return sumOfAllSupportingLangs;
    }, ['desc']);

    _.forEach(sorteduserDatawithoutDistinction, (userData) => {
      userData.rank = i;
      i++;
    });

    finalList = finalList.concat(sorteduserDatawithoutDistinction);
    return finalList;
  }
}

var self = module.exports = exports = new rank();
