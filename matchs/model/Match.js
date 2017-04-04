'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bet = require('../../bets/model/Bet');

const matchModel = new Schema({
  date: { type: String, required: true },
  domicile: { type: String, required: true },
  exterieur: { type: String, required: true },
  limite:  Number ,
  scoreDom: { type: Number, min:0, defaultsTo:0},
  scoreExt: { type: Number, min:0, defaultsTo:0 },
  //bets: {collection: 'Bet'  },
  vainqueur: { type: String, required: false }
});

module.exports = mongoose.model('Match', matchModel);