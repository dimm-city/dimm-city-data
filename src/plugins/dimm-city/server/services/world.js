'use strict';

/**
 * world service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::dimm-city.world');
