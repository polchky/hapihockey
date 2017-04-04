'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/users',
  config: {
    tags: ['api'],
      description: 'Get all the user',
      notes: 'Returns a list of all user, must be logged as admin',

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
    handler: (req, res) => {
      User
        .find()
        // Deselect the password and version fields
        .select('-password -__v')
        .exec((err, users) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          if (!users.length) {
            throw Boom.notFound('No users found!');
          }
          return res(users).header('Authorization', request.headers.authorization);
        })
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token',
      scope: ['admin']
    },
  
  }
}