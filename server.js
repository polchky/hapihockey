'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
const privateKey = require('./config');
const Util = require('util');
//const ttl = 1 * 30 * 1000 * 60; //1 hour

const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: 8000 });

//declare mongoDB
const dbUrl = 'mongodb://localhost:27017/hapi-hockey';

// validate the token supplied in request header
function validate(req, res) {
  var token = req.headers.scope;
  try {
    var decoded = jwt.verify(token, secret);
  } catch (e) {
    return authFail(res);
  }
  if(!decoded || decoded.auth !== 'magic') {
    return authFail(res);
  } else {
    return privado(res, token);
  }
}

server.register([{
    register: require('hapi-auth-jwt')
}], function(err) {
    server.auth.strategy('token', 'jwt', {
        validateFunc: validate,
        key: privateKey
    });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('**/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  Util.log(`Server started on port 8000`);
  // Once started, connect to Mongo through Mongoose
  mongoose.connect(dbUrl, {}, (err) => {
    if (err) {
      throw err;
    }
  });
});