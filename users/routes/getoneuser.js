'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const console = require('better-console');

var computeBetScore = require('../util/scoreFunctions').computeBetScore;

module.exports = {
  method: 'GET',
  path: '/users/{id}',
  config: {
    tags: ['api'],
      description: 'Get one user',
      notes: 'Returns the information of the user logged',

      validate: {
    params: {

          id : Joi.objectId()
                  .required()
                  .description('the ID of the user to fetch')

        }
      },

  plugins: {
            'hapi-swagger': {

                responses: {
                    '400': {
                        description: 'BadRequest'
                    },
                    '200':{ 
                      description: 'Success'
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (req, res) => {

        var betDom=[];
        var betExt=[];
        var scoreDom=[];
        var scoreExt=[];
        var matchpoints =0;
        var totalpoints =0;

      User
        .findById(req.params.id)
        // Deselect the password and version fields
        .select('-__v -bets')
        .exec((err, users) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          Bet
        .find({'user': req.params.id})
        .select('_id scoreDom scoreExt match')
        .populate({
          path: 'match', select:'scoreDom scoreExt',
        })
        .exec(function(err, bet){
            if(!err) {

              for (var i = 0; i < bet.length; i++) {

                if(bet[i].match !== null){

                  betDom[i] = bet[i].scoreDom;
                       betExt[i] = bet[i].scoreExt;
                       scoreDom[i] = bet[i].match.scoreDom;
                       scoreExt[i] = bet[i].match.scoreExt;

                       matchpoints = computeBetScore(scoreDom[i], scoreExt[i],betDom[i], betExt[i]);

                       Bet.findByIdAndUpdate(bet[i]._id, 
                       {$set: {score: matchpoints}},
                       {safe: true, upsert: true},
                        function(err, model) {
                          if(err){
                            console.log(err);
                          }
                           }
                       );

                       totalpoints += matchpoints
                }
              }

                    User.findByIdAndUpdate(req.params.id, 
                    {$set: {points: totalpoints}}, 
                    {safe: true, upsert: true},
                      function(err, model) {
                        if(!err){
                          console.log(totalpoints);
      }
    });

        //return res(totalpoints); // HTTP 200
            
      }
    //return res(Boom.badImplementation(err)); // 500 error
});
          return res(users);
        })
    },
  // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    }
  }
}