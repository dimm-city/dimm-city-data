'use strict';

/**
 * historical-event service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::historical-event.historical-event');
