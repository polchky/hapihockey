'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Match = require('../../matchs/model/Match');
const createBetSchema = require('../schemas/createBet');
const updateBetSchema = require('../../bets/schemas/updateBet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'PUT',
  path: '/users/{id}/bets',
  config: {
    tags: ['api'],
      description: 'Update a bet by its ID',
      notes: 'Update a bet document in the DB',

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
  validate: {
    payload: updateBetSchema,

params: {

          bet_id : Joi.objectId()
                  .required()
                  .description('the ID of the BET to fetch')

        }

  },
  handler: function (request, reply) {
    Bet.findByIdAndUpdate(request.params.bet_id , request.payload, function (err, bet) {
      if (!err) {
            return reply(bet); // HTTP 201
      
      }
      else{ 
        return reply(Boom.badImplementation(err)); // 500 error
      }
    });
    
  },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    },
  
  }
}

