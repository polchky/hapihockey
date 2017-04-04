'use strict';

const console = require('better-console');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Boom = require('boom');
const Match = require('../model/Match');
const mongoose = require('mongoose');
const createMatchSchema = require('../schemas/createMatch');
const updateMatchSchema = require('../schemas/updateMatch');
const today = new Date().getTime();

exports.getAll = {
  //if(limite-today>0) Todo: return all the non ended matchs

  tags: ['api'],
      description: 'Get the match list',
      notes: 'Returns all the match item',

  plugins: {
            'hapi-swagger': {
                responses: {
                   '200':{ 
                      description: 'List of matchs'
                    },
                    '400': {
                        description: 'BadRequest'
                    }
                   
                },
                payloadType: 'form'
            }
        }
      ,

  handler: function (request, reply) {
    Match.find({}, function (err, match) {
      if (!err) {
        return reply(match);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  },
  
};

exports.getOne = {

  tags: ['api'],
      description: 'Get one match by its ID',
      notes: 'Returns one match item',

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
        }
      ,
      validate: {

        params: {

          id : Joi.objectId()
                  .required()
                  .description('the ID of the match to fetch')

        }

      },
  handler: function (request, reply) {
    Match.findOne({ '_id': request.params.id }, function (err, match) {
      if (!err) {
        return reply(match);
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
  }
};

exports.create = {
  tags: ['api'],
      description: 'Create a match',
      notes: 'Insert a match item in the DB',

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
        }
      ,
  validate: {
    payload: createMatchSchema
  },
  handler: function (request, reply) {
    var datelimite = new Date(request.payload.date).getTime();
    var match = new Match({date:request.payload.date, domicile: request.payload.domicile, exterieur:request.payload.exterieur, limite : datelimite});
    match.save(function (err, match) {
      if (!err) {
        return reply(match).created('/match/' + match._id); // HTTP 201
      }
      return reply(Boom.badImplementation(err)); // 500 error
    });
    console.log(datelimite);
    
    //match.update(match.limite, datelimite);
  },
  auth: {
      strategy: 'token',
      scope :["admin"]

    }
};

exports.update = {
  tags: ['api'],
      description: 'Update a match',
      notes: 'Update a match document in the DB',

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
    payload: updateMatchSchema
  },
  handler: function (request, reply) {
    Match.findOneAndUpdate({ '_id': request.params.id }, request.payload, function (err, match) {
      if (!err) {
            return reply(match); // HTTP 201
      
      }
      else{ 
        return reply(Boom.badImplementation(err)); // 500 error
      }
    });
  }
};

exports.remove = {
  tags: ['api'],
      description: 'Create a match',
      notes: 'Insert a match item in the DB',

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
    Match.findOneAndRemove({ '_id': request.params.id }, function (err, match) {
      if (!err && match) {
        return reply({ message: "Match deleted successfully"});
      }
      if (!err) {
        return reply(Boom.notFound()); //HTTP 404
      }
      return reply(Boom.badRequest("Could not delete user"));
    });
  }
};

exports.removeAll = {
  handler: function (request, reply) {
    mongoose.connection.db.dropCollection('matchs', function (err, result) {
      if (!err) {
        return reply({ message: "Match database successfully deleted"});
      }
      return reply(Boom.badRequest("Could not delete match"));
    });
  }
};