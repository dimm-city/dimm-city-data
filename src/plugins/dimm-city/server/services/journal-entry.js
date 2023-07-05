'use strict';

/**
 * journal-entry service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::dimm-city.journal-entry');
