'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
const Match = require('../../matchs/model/Match');
const createBetSchema = require('../schemas/createBet');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'DELETE',
  path: '/users/{id}/bets',
  config: {
    tags: ['api'],
      description: 'Delete a bet',
      notes: 'Remove a bet item from the DB',

      validate: {
    params: {

          bet_id : Joi.objectId()
                  .required()
                  .description('the ID of the user which deletes his bet')

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
  handler: function (request, reply) {
    Bet.findByIdAndRemove(request.params.bet_id , function (err, bet) {
      if (!err && bet) {
        return reply({ message: "Bet deleted successfully"});
      }
      if (!err) {
        return reply(Boom.notFound()); //HTTP 404
      }
      return reply(Boom.badRequest("Could not delete bet"));
    });
  },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    },
  
  }
}

