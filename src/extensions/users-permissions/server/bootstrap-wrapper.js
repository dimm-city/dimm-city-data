const _ = require("lodash");
const urljoin = require("url-join");

const strapi_bootstrap = require("@strapi/plugin-users-permissions/server/bootstrap");
const { getAdditionalGrantConfigs } = require("./additional-providers");

module.exports = async ({ strapi }) => {
  const pluginStore = strapi.store({
    type: "plugin",
    name: "users-permissions",
  });

  // Get a copy of the current grant config from the db
  let dbConfig = (await pluginStore.get({ key: "grant" })) || {};

  //Call default bootstrap for users and permissions
  await strapi_bootstrap({ strapi });

  // merge updated strapi grant config with previous grant config for core providers
  // this is necessary due to an issue with the implementation of the user-permissions boostrap
  const updatedCoreGrantConfig =
    (await pluginStore.get({ key: "grant" })) || {};
  dbConfig = _.merge(dbConfig, updatedCoreGrantConfig);

  //add or update grant config for additional providers
  const apiPrefix = strapi.config.get("api.rest.prefix");
  const baseURL = urljoin(strapi.config.server.url, apiPrefix, "auth");
  const additionalGrantConfig = getAdditionalGrantConfigs(baseURL);

  _.keys(additionalGrantConfig).forEach((key) => {
    if (key in dbConfig) {
      dbConfig[key] = _.merge(
        additionalGrantConfig[key],
        dbConfig[key]
      );
    } else {
      dbConfig[key] = additionalGrantConfig[key];
    }
  });

  await pluginStore.set({ key: "grant", value: dbConfig });
};
