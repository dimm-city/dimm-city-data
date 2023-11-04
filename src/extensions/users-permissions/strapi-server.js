const user = require("./content-types/user");

module.exports = (plugin) => {
  plugin.contentTypes.user = user;
  plugin.bootstrap = require("./server/bootstrap-wrapper");
  plugin.services = require("./server/services");
  plugin.controllers.auth = require("./server/controllers/auth");
  return plugin;
};
