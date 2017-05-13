'use strict';

const Joi = require('joi');

//const limite = new Date(dateString);

const createMatchSchema = Joi.object({
            date: Joi.string().required().description('ex: April 4, 2017 20:15:00'),

            domicile: Joi.string().required().description('the domicile team'),

            exterieur: Joi.string().required().description('the exterior team'),

            //heure: Joi.string().required(),
        
            //limite: Joi.number().integer().optional().description('the number of milliseconds since 1970/01/01 to the beginning of match'),

            scoreDom: Joi.number().integer().optional(),

            scoreExt: Joi.number().integer().optional()
});

module.exports = createMatchSchema;