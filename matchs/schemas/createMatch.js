'use strict';

const Joi = require('joi');

//const limite = new Date(dateString);

const createMatchSchema = Joi.object({
            date: Joi.string().required().description('the date of the match'),

            domicile: Joi.string().required().description('the domicile team'),

            exterieur: Joi.string().required().description('the exterior team'),

            //heure: Joi.string().required(),
        
            //limite: Joi.number().integer().optional().description('the number of milliseconds since 1970/01/01 to the beginning of match'),

            score_dom: Joi.number().integer().optional(),

            score_ext: Joi.number().integer().optional()
});

module.exports = createMatchSchema;