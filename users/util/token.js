'use strict';

const jwt = require('jsonwebtoken');
const privateKey = require('../../config');

function createToken(user) {
  let scopes;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  if (user.admin) {
    scopes = 'admin';
  }
  // Sign the JWT
  var tokenData = {
    userName: user.username,
    scope: scopes,
    id: user._id
                    };
  
  return jwt.sign({ tokenData }, privateKey, { algorithm: 'HS256', expiresIn: "1h"} );
}

module.exports = createToken;