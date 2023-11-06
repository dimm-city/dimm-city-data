"use strict";
const cronTasks = require("./config/cron-tasks");
module.exports = ({ strapi }) => {
  const plugin = strapi.plugin("chain-wallets");
  if (plugin) {
    const enableCron = plugin?.config("enableCron") ?? false;
    console.log("Chain Wallets Cron enabled:", enableCron);
    if (enableCron == true) strapi.cron.add(cronTasks);
  } else {
      strapi.log.warn(
        "Chain Wallets cron not enabled. Failed to load configuration.",
        strapi.config
      );
  }
};
