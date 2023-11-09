"use strict";

/**
 * profile router.
 */

const { info } = require("../../content-types/profile/schema.json");

module.exports = [
  {
    method: "POST",
    path: "/profiles/associate-login",
    handler: "profile.associateLogin",
    config: {
      prefix: "",
    },
  },
  {
    method: "POST",
    path: "/profiles/remove-login/:id",
    handler: "profile.removeLogin",
    config: {
      prefix: "",
    },
  },
  {
    method: "GET",
    path: `/users/me/profile`,
    handler: `${info.singularName}.getMyProfile`,
    config: {
      prefix: "",
    },
  },
  {
    method: "GET",
    path: `/${info.pluralName}`,
    handler: `${info.singularName}.find`,
    config: {
      prefix: "",
    },
  },
  {
    method: "GET",
    path: `/${info.pluralName}/:id`,
    handler: `${info.singularName}.findOne`,
    config: {
      prefix: "",
    },
  },
  {
    method: "POST",
    path: `/${info.pluralName}`,
    handler: `${info.singularName}.create`,
    config: {
      prefix: "",
    },
  },
  {
    method: "PUT",
    path: `/${info.pluralName}/:id`,
    handler: `${info.singularName}.update`,
    config: {
      policies: ["owns-profile"],
      prefix: "",
    },
  },
];
