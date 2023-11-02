"use strict";

const strapi_registry = require("@strapi/plugin-users-permissions/server/services/providers-registry");
const { getAdditionalProviders } = require('./additional-providers');

module.exports = () => {
  const purest = require("purest");
  const additionalProvidersCallbacks = getAdditionalProviders({ purest });


  return {
    /** Reuse the default register function */
    register: strapi_registry.register,


    /**
     * Override the default implementation of the run function.
     * We first check to see if there is a custom provider callback for the provider.
     * If not, we call the default run function.
     */
    async run({ provider, accessToken, query, providers }) {
      if (!additionalProvidersCallbacks[provider]) {
        return strapi_registry.run({ provider, accessToken, query, providers });
      }

      const providerCb = additionalProvidersCallbacks[provider];

      return providerCb({ accessToken, query, providers });
    },
  };
};
