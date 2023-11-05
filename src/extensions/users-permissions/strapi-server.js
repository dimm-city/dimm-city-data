module.exports = (plugin) => {
  plugin.contentTypes.user = require("./content-types/user");
  plugin.contentTypes.profile = require("./content-types/profile");
  plugin.bootstrap = require("./server/bootstrap-wrapper");
  plugin.services = require("./server/services");
  plugin.controllers.profile = require("./server/controllers/profile");
  plugin.controllers.providers = require("./server/controllers/providers");

  const routes = require("./server/routes");
  plugin.routes["content-api"].routes.push(...routes);
  plugin.policies = require("./server/policies");

  return plugin;
};
