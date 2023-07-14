'use strict';

/**
 * skill-tree router.
 */

const { info } = require("../content-types/skill-tree/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `skill-tree.find`,
    config: {},
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `skill-tree.findOne`,
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
