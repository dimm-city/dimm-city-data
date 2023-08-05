"use strict";

module.exports = ({ strapi }) => {
  // bootstrap phase
  strapi.db.lifecycles.subscribe({
    models: ["plugin::users-permissions.user"],

    async afterCreate(event) {
      const { result, params } = event;
      console.log(
        "################################### user created ##############################"
      );
      console.log(result);

      //Get chain-wallet service and create wallet for user
      // const chainWalletService = strapi.plugin('chain-wallet').service('chain-wallet');
      // chainWalletService.createWallet(result.id);
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
};
