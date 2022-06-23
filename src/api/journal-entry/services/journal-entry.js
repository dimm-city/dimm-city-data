'use strict';

/**
 * journal-entry service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::journal-entry.journal-entry');
