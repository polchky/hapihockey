'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Match = require('../../matchs/model/Match');
const createBetSchema = require('../schemas/createBet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'POST',
  path: '/users/{id}/bets',
  config: {
    tags: ['api'],
      description: 'Create a bet related to the user id',
      notes: 'Insert a bet document in the DB',


      validate:{

          payload: createBetSchema,

          params: {

          id : Joi.objectId()
                  .required()
                  .description('the ID of the user which bets')

        }
      },
  plugins: {
            'hapi-swagger': {
              //security: [{ 'token': [] }],
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
    handler: (request, reply) => {
      var bet = new Bet({user: request.params.id, match:request.payload.match, scoreDom:request.payload.scoreDom, 
          scoreExt: request.payload.scoreExt});
       //console.log(request.payload.user);
       bet.save(function (err, bet) {
      if (!err) {
        return reply(bet).created('/bet/' + bet._id); // HTTP 201
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });


            User.findByIdAndUpdate(request.params.id, {
        
            $push: {bets: bet}, function (err, user) {
                if (!err){
                    return reply(user); // HTTP 201
                }
                return reply(Boom.badImplementation(err)); // 500 error
            }
            
        },
        {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
    );

    Match.findByIdAndUpdate(request.payload.match, {
            
            $push: {bets: bet}, function (err, match) {
                if (!err){
                    return reply(match); // HTTP 201
                }
                return reply(Boom.badImplementation(err)); // 500 error
            }
            
        },
        {safe: true, upsert: true},
    function(err, model) {
        console.log(err);
    }
    );  
        
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
      //scope: ['admin']
    },
  
  }
}

