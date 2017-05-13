'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


//const limite = new Date(dateString);

const updateBetSchema = Joi.object({
            scoreDom: Joi.number().integer().required().description('score of domicile team'),

            scoreExt: Joi.number().integer().required().description('score of exterior team'),

            //score : Joi.number().integer().optional(),

            //match: Joi.objectId(),

            //user: Joi.objectId()
});

module.exports = updateBetSchema;