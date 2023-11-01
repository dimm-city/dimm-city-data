const user = require("./content-types/user");

module.exports = (plugin) => {
  plugin.contentTypes.user = user;
  plugin.bootstrap = require("./server/bootstrap");
  plugin.services["providers"] = require("./server/providers");

  return plugin;
};
