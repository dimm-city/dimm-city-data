'use strict';

/**
 * journal-entry router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('plugin::dimm-city.journal-entry');
