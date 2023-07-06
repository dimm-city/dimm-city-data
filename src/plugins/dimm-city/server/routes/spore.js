'use strict';

/**
 * spore router
 */

const { info } = require("../content-types/spore/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `${info.singularName}.find`,
    config: {
    },
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `${info.singularName}.findOne`,
    config: {},
  },
];
