'use strict';

/**
 * race router.
 */

const { info } = require("../content-types/race/schema.json");

module.exports = [
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `${info.singularName}.find`,
    config: {},
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `${info.singularName}.findOne`,
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
