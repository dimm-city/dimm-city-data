'use strict';

/**
 * character-release router.
 */

const { info } = require("../content-types/character-release/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `characterRelease.find`,
    config: {},
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `characterRelease.findOne`,
    config: {},
  },
];
