'use strict';

const Bet = require('../../bets/model/Bet');
const Match = require('../../matchs/model/Match');
const User = require('../../users/model/User');

// getMatch
// 
// @description :: Get a match from its id
// @param       :: matchId (required): the match's id concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getMatch(matchId, cb, checkExistence) {
  Match
    .findOne(matchId)
    .exec(function (err, match) {
      if(err) {
        return cb(err);
      }

      if(checkExistence && !match) {
        return cb(new Error('No match for id "' + matchId + '"'));
      }

      return cb(null, match);
  });
}

// getUser
// 
// @description :: Get a user from its id
// @param       :: userId (required): the user's id concerned
//                 cb (required): the function called when it's done or an
//                 error occured
//                 checkExistence: does it need to throw an error if no instance
//                 found
function getUser(userId, cb, checkExistence) {
  User
    .findOne(userId)
    .exec(function (err, user) {
      if(err) {
        return cb(err);
      }
      
      if(checkExistence && !user) {
        return cb(new Error('No user for id "' + userId + '"'));
      }

      return cb(null, user);
  });
}


function getBetsFromMatch(matchId, cb, checkExistence) {
  Bet
    .find({ match: matchId })
    .populate('User')
    .limit(0)
    .exec(function (err, bets) {
      if(err) {
        return cb(err);
      }
      
      if(checkExistence && !bets) {
        return cb(new Error('No bets for match "' + matchId + '"'));
      }

      return cb(null, bets);
  });
}

// betWinnerIsMatchWinner
//
// @description :: return true if has bet on the good winner (or tie)
// @param       :: match (required): the match instance
//                 bet (require): the bet concerned
function betWinnerIsMatchWinner(match, bet) {
  var DomWins = match.scoreDom > match.scoreExt;
  var tie = match.scoreDom === match.scoreExt;
  
  var betOnDom = bet.scoreDom > bet.scoreExt;
  var betTie = bet.scoreDom === bet.scoreExt;

  return ((DomWins && betOnDom) ||
        (tie && betTie) ||
        (!DomWins && !betOnDom && !tie && !betTie));//if Exterior wins and user bet on exterior and not on tie
}



function goodWinnerandOneScore(match, bet) {
  betWinnerIsMatchWinner(match, bet);

  var resultDom = match.scoreDom- bet.scoreDom ;
  var resultExt = match.scoreExt - bet.scoreExt;

  return (ResultDom == 0 || ResultExt == 0);

}

//perfectBet
//
// @description :: return true if has bet on the good score for the 2 teams
// @param       :: match (required): the match instance
//                 bet (require): the bet concerned
function perfectBet(match, bet) {
  
  var resultDom = match.scoreDom- bet.scoreDom ;
  var resultExt = match.scoreExt - bet.scoreExt;

  return (ResultDom == ResultExt  == 0);


}
    

// computeBetScore
//
// @description :: Calculate a bet score
//                 
// @param       :: match (required): the match instance
//                 bet (require): the bet concerned
function computeBetScore(match, bet) {
  var score = 0;

  // 1. 
  if(perfectBet(match, bet)) {
    score = 6;
  }
  //2
  else if(goodWinnerandOneScore(match, bet)){
    score = 4;
  }
  //3
  else if(betWinnerIsMatchWinner(match, bet)){
    score = 2;
  }

  return score;
}


// updateBetScore
// 
// @description :: Update a bet's score attribute in db
// @param       :: match (required): the match to update
//                 bet (required): the single bet concerned
//                 cb (required): the function called when it's done or an
//                 error occured
function updateBetScore(match, bet) {

  bet.score = computeBetScore(match, bet);

}

// increaseUserScore
// 
// @description :: Update a user's score attribute in db
// @param       :: user (required): the user to update
//                 betScore (required): the single bet score value
//                 cb (required): the function called when it's done or an
//                 error occured
function increaseUserScore(user, match, bet) {
  user.points += updateBetScore(match,bet, cb);

}

function updateUserScoreFromBet(userId, betScore, cb) {
  getUser(userId, function (err, user) {
    if(err) {
      return cb(err);
    }

    increaseUserScore(user, betScore, cb);
  });
}

 // computeAllScoresFromMatch
  // 
  // @description :: Compute all scores attributes after the end of a match
  // @param       :: matchId (required): the match concerned
  //                 cb (required): the function called when it's done or an
  //                 error occured
   function computeAllScoresFromMatch(matchId, cb) {
    // Check params
    if(!matchId || !cb) {
      
      //sails.log.error('need 2 params: ');
      //sails.log.error('* matchId: the match concerned');
      //sails.log.error('* cb: the callback');

      return cb(new Error('Missing param'));
    }

    if(typeof cb !== 'function') {

      sails.log.error('2nd argument must be a function');

      return cb(new Error('Invalid param'));
    }

    // 1. Get the match informations
    // 2. Get the bets concerned
    // 3. Update each of them
    // 4. Update users' scores
    async.waterfall([
      function (next) {
        getMatch(matchId, next);
      },
      function (match, next) {
        getBetsFromMatch(matchId, function (err, bets) {
          return next(err, match, bets);
        });
      },
      function (match, bets, next) {
        updateScores(match, bets, next);
      }
    ], cb);
   }


module.exports.updateBetScore = updateBetScore;
module.exports.increaseUserScore = increaseUserScore;