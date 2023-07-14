'use strict';

/**
 * journal-entry router.
 */

const { info } = require("../content-types/journal-entry/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `journal-entry.find`,
    config: {},
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `journal-entry.findOne`,
    config: {},
  },
  {
    method: "POST",
    path: `/${info.pluralName}`,
    handler: `${info.singularName}.create`,
    config: {},
  },
  {
    method: "PUT",
    path: `/${info.pluralName}/:id`,
    handler: `${info.singularName}.update`,
    config: {},
  },
];
