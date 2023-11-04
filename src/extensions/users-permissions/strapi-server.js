const user = require("./content-types/user");

module.exports = (plugin) => {
  plugin.contentTypes.user = user;
  plugin.bootstrap = require("./server/bootstrap-wrapper");
  plugin.services = require("./server/services");
  plugin.controllers.profiles = require("./server/controllers/profiles");

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/profiles/associate",
    handler: "profiles.associateLogin",
  });
  return plugin;
};
