'use strict';

/**
 * payment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::dimm-city.payment');
