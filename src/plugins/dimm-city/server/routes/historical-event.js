'use strict';

/**
 * historical-event router.
 */

const { info } = require("../content-types/historical-event/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `historical-event.find`,
    config: {
    },
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `historical-event.findOne`,
    config: {},
  },
];
