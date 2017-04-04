'use strict';

const Match = require('../controller/match');




module.exports = ([

    { method: 'GET', path: '/match', config: Match.getAll},
    
    { method: 'POST', path: '/match', config:  Match.create }, 

    { method: 'GET', path: '/match/{id}', config: Match.getOne}, 
  
    { method: 'PUT', path: '/match/{id}', config: Match.update}, 

    { method: 'DELETE', path: '/match/{id}', config: Match.remove}, 

  ]);