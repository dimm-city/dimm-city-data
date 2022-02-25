'use strict';

/**
 * skill-tree service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::skill-tree.skill-tree');
