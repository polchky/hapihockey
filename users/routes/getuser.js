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
              //security: [{ 'token': [] }],
                responses: {
                    '400': {
                        description: 'BadRequest'
                    },
                    '404':{
                        description: 'NotFound'
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
        // Deselect the version field
        .select('-__v')
        .exec((err, users) => {
          if (err) {
            return res(Boom.badRequest(err)); //400 error
          }
          if (!users.length) {
            return res(Boom.notFound('No users found!')); //404 error
          }
          return res(users);
        })
    },
    // Add authentication to this route
    // The user must have a scope of `admin`
    auth: {
      strategy: 'token'
    },
  
  }
}