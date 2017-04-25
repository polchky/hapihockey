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
        return res({ message: "User deleted successfully"});
      }
      if (!err) {
        return res(Boom.notFound()); //HTTP 404
      }
      return res(Boom.badRequest("Could not delete user"));
    });
    },
  
  }
}