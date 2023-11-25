"use strict";

/**
 * character router.
 */
const { info } = require("../content-types/character/schema.json");

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
    config: {
      policies: ["owns-token"],
    },
  },
  {
    method: "GET",
    path: `/my/characters`,
    handler: `${info.singularName}.my`,
    config: {},
  },
];
