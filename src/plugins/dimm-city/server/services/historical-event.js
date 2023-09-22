'use strict';

/**
 * historical-event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::dimm-city.historical-event');
