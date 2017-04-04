'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bet = require('../../bets/model/Bet');

const userModel = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  bets: [{type: Schema.Types.ObjectId, ref: 'Bet'}],
  score: {type: Number, min:0, defaultsTo: 0}
});

module.exports = mongoose.model('User', userModel);