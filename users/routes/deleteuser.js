'use strict';

const User = require('../model/User');
const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  method: 'DELETE',
  path: '/users/{id}',
  config: {
    tags: ['api'],
      description: 'Delete a user',
      notes: 'Removes a user from the DB, must be logged as admin',

      validate: {
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
      User.findByIdAndRemove(req.params.id , function (err, user) {
      if (!err && user) {
        //match.remove();
        return res({ message: "User deleted successfully"});
      }
      if (!err) {
        return res(Boom.notFound()); //HTTP 404
      }
      return res(Boom.badRequest("Could not delete user"));
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