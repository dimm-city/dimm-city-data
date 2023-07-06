'use strict';

/**
 * skill-tree router.
 */

const { info } = require("../content-types/skill-tree/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `skillTree.find`,
    config: {
    },
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `skillTree.findOne`,
    config: {},
  },
];
