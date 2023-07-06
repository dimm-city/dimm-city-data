'use strict';

/**
 * journal-entry router.
 */

const { info } = require("../content-types/journal-entry/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `journalEntry.find`,
    config: {
    },
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `journalEntry.findOne`,
    config: {},
  },
];
