const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "plugin::chain-wallets.chain-wallet",
  () => ({
    async createUserWallet(user) {
      const wallet = ethers.Wallet.createRandom();

      // const existingUsers = await strapi.entityService.findMany(
      //   "api::users-permissions.user",
      //   {
      //     filters: {
      //       username: model.username,
      //     },
      //   }
      // );
      //console.log("existing user", result);
      console.log(
        "created new user",
        user,
        wallet.mnemonic.phrase,
        wallet.privateKey
      );

      const walletEntity = await strapi.entityService.create(
        "plugin::chain-wallets.chain-wallet",
        {
          data: {
            managed: true,
            address: wallet.address,
            seed: wallet.mnemonic.phrase,
            key: wallet.privateKey,
            encKey: wallet.privateKey,
            user: user,
            blockchain: {
              id: 2,
            },
          },
        }
      );
      return walletEntity;
    },
  })
);
