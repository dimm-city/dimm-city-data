'use strict';

/**
 * spore service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::dimm-city.spore');
