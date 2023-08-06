"use strict";

module.exports = async ({ strapi }) => {
  // bootstrap phase
  strapi.db.lifecycles.subscribe({
    models: ["plugin::users-permissions.user"],

    async afterCreate(event) {
      const { result, params } = event;

      //Get chain-wallet service and create wallet for user
      await strapi.plugins["chain-wallets"].services[
        "chain-wallet"
      ].createManagedUserWallet(result, "mainnet");

      //Create profile entity and assign it to the user
      await strapi.plugins["dimm-city"].services.profile.create({
        data: {
          displayName: result.username,
          email: result.email,
          user: result.id,
        },
      });
    },
  });

  //load all users that do not have a profile
  const users = await strapi.query("plugin::users-permissions.user").findMany({
    where: {
      profile: null,
    },
  });
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    await strapi.plugins["dimm-city"].services.profile.create({
      data: {
        displayName: element.username,
        email: element.email,
        user: element.id,
      },
    });
  }
};
