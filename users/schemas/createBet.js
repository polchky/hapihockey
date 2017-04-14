'use strict';

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


//const limite = new Date(dateString);

const createBetSchema = Joi.object({
            scoreDom: Joi.number().integer().required(),

            scoreExt: Joi.number().integer().required(),

            //points: Joi.number().integer().optional(),

            match: Joi.objectId().required(),

            //user: Joi.objectId().required()
});

module.exports = createBetSchema;