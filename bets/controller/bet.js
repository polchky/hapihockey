'use strict';

const Bet = require('../model/Bet');
const createBetSchema = require('../schemas/createBet');
const Boom = require('boom');
const User = require('../../users/model/User');


exports.create = {
    tags: ['api'],
      description: 'Create a bet',
      notes: 'Insert a bet document in the DB',

  plugins: {
            'hapi-swagger': {
                security: [{ 'token': [] }],
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
    payload: createBetSchema
  },
  handler: function (request, reply) {
       var bet = new Bet(request.payload);
       //var user = new User();
       bet.save(function (err, bet) {
      if (!err) {
        return reply(bet).created('/bet/' + bet._id); // HTTP 201
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
        User.findByIdAndUpdate(request.payload.user, {
            $set: {bets: [bet]}, function (err, user) {
                if (!err){
                    return reply(user); // HTTP 201
                }
                return reply(Boom.badImplementation(err)); // 500 error
            }
        });
  },
  // Add authentication to this route
    auth : 'token'
}