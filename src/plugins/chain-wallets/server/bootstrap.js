"use strict";
const cronTasks = require("./config/cron-tasks");
module.exports = ({ strapi }) => {

  if(!strapi.config?.plugins || !strapi.config?.plugins["chain-wallets"]){
    strapi.log.warn("Chain Wallets not enabled. Failed to load configuration.", strapi.config);
    return;
  }
  const cwConfig = strapi.config?.plugins["chain-wallets"];
  const enableCron = cwConfig?.config?.enableCron ?? false;
  console.log("Chain Wallets Cron enabled:", enableCron);
  if (enableCron == true) strapi.cron.add(cronTasks);
};
