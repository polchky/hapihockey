'use strict';

const Joi = require('joi');

const updateMatchSchema = Joi.object({

            date: Joi.string().optional(),
    
            domicile: Joi.string().optional(),

            exterieur: Joi.string().optional(),

            scoreDom: Joi.number().integer().optional(),

            scoreExt: Joi.number().integer().optional()

            });

module.exports = updateMatchSchema;