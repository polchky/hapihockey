'use strict';

const User = require('../model/User');
const Boom = require('boom');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const console = require('better-console');

const updateBetScore = require('../util/scoreFunctions').updateBetScore;
const increaseUserScore = require('../util/scoreFunctions').increaseUserScore;

module.exports = {
  method: 'GET',
  path: '/users/{id}/score',
  config: {
    tags: ['api'],
      description: 'Compute the score for the bets of one user',
      notes: 'Returns the points obtained per bet',


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
      if (!err) {
        return res(user);
      }
      return res(Boom.badImplementation(err)); // 500 error
    }*/)
        .populate('bets')
        .exec(function(err, bets){
            if(!err) {
                 
            for(var i=0; i<bets.length; i++){
                console.log(bets[i].match);
               // Match.findById(bets[i].match)
                
                

            }
            return res(bets);
      }
    return res(Boom.badImplementation(err)); // 500 error
});   
        
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
   /* auth: {
      strategy: 'token',
      //scope: ['admin']
    },*/
  
  }
}

