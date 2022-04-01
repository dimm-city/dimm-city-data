'use strict';

/**
 * character service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const service = createCoreService('api::character.character');
module.exports = service;
