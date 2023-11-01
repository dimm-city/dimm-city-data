const user = require("./content-types/user");

module.exports = (plugin) => {
  plugin.contentTypes.user = user;
  plugin.bootstrap = require("./server/bootstrap-wrapper");
  plugin.services = require("./server/services");
  return plugin;
};
