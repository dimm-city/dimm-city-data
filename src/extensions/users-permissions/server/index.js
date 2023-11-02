"use strict";

const register = require("@strapi/plugin-users-permissions/server/register");
const contentTypes = require("@strapi/plugin-users-permissions/server/content-types");
const middlewares = require("@strapi/plugin-users-permissions/server/middlewares");
const routes = require("@strapi/plugin-users-permissions/server/routes");
const controllers = require("@strapi/plugin-users-permissions/server/controllers");
const config = require("@strapi/plugin-users-permissions/server/config");

const bootstrapWrapper = require("./bootstrap-wrapper");
const services = require("./services");

module.exports = () => ({
  register,
  bootstrap: bootstrapWrapper,
  config,
  routes,
  controllers,
  contentTypes,
  middlewares,
  services,
});
