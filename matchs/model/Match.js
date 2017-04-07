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
  bets: [{type: Schema.Types.ObjectId, ref: 'Bet', unique:true}],
  //bets: {collection: 'Bet'  },
  //vainqueur: { type: String, required: false }
});

/*matchModel.post('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Bet.remove({client_id: this._id}).exec();
    next();
});*/

module.exports = mongoose.model('Match', matchModel);