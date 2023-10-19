"use strict";
const cronTasks = require("./config/cron-tasks");
module.exports = ({ strapi }) => {
  const cwConfig = strapi.config?.plugins["chain-wallets"];
  const enableCron = cwConfig?.config?.enableCron ?? false;
  console.log("Chain Wallets Cron enabled:", enableCron);
  if (enableCron == true) strapi.cron.add(cronTasks);
};
