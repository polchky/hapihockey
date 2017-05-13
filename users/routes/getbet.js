'use strict';

const User = require('../model/User');
const Bet = require('../../bets/model/Bet');
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
              
                responses: {
                    '400': {
                        description: 'BadRequest'
                    },
                    '200':{ 
                      description: 'Success'
                    },
                    '404':{
                      description: 'NotFound'
                    }
                },
                payloadType: 'form'
            }
        },
    handler: (req, res) => {
      Bet
        .find({"user": req.params.id})
        .select('-password -user -admin -__v')
        //.populate({path: 'match', select: 'domicile exterieur date'})
        .exec(function(err, bets){
            if(err) {
        return res(Boom.badRequest(err)); // 400 error
      }
            if(!bets.length){

              return res(Boom.notFound('The user has no bets'))
            }

            return res(bets);
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

