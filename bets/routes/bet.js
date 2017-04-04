'use strict';

const Bet = require('../controller/bet');




module.exports = ([

    //{ method: 'GET', path: '/match', config: Match.getAll},
    
    { method: 'POST', path: '/bet', config:  Bet.create }, 

    //{ method: 'GET', path: '/match/{id}', config: Match.getOne}, 
  
    //{ method: 'PUT', path: '/match/{id}', config: Match.update}, 

    //{ method: 'DELETE', path: '/match/{id}', config: Match.remove}, 

  ]);