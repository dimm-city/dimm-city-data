'use strict';

/**
 * twine-story service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::twine-story.twine-story');
