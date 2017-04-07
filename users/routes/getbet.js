'use strict';

const User = require('../model/User');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  method: 'GET',
  path: '/users/{id}/bets',
  config: {
    tags: ['api'],
      description: 'Get the bets for the user id',
      notes: 'Returns the all the bets of one user',


      validate:{
          params: {

          id : Joi.objectId()
                  .required()
                  .description('the ID of the user to fetch')

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
    handler: (req, res) => {
      User
        .findById(req.params.id/*,function (err, user) {
      /*if (!err) {
        return res(user);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    }*/)
        .select('-password -admin -__v')
        .populate('bets')
        .exec(function(err, bets){
            if(!err) {
        return res(bets);
      }
    return res(Boom.badImplementation(err)); // 500 error
});   
        
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
      //scope: ['admin']
    },
  
  }
}

