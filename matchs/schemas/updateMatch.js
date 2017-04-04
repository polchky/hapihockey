'use strict';

const Joi = require('joi');

const updateMatchSchema = Joi.object({

            date: Joi.string().optional(),
    
            domicile: Joi.string().optional(),

            exterieur: Joi.string().optional(),

            heure: Joi.string().optional(),
        
            limite: Joi.number().integer().optional(),

            score_dom: Joi.number().integer().optional(),

            score_ext: Joi.number().integer().optional()

            });

module.exports = updateMatchSchema;