//https://forum.strapi.io/t/strapi-create-new-user-users-permissions-plugin-lifecycles/13386/5
const schema = require("./schema.json");
const ethers = require("ethers");

module.exports = {
  schema,
  lifecycles: {
    async afterCreate(event) {
      console.log("afterCreate********************");
      const { result } = event;
      const wallet = ethers.Wallet.createRandom();

      try {
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
          result,
          wallet.mnemonic.phrase,
          wallet.privateKey
        );

        const walletEntity = await strapi.entityService.create(
          "api::wallet.wallet",
          {
            data: {
              managed: true,
              address: wallet.address,
              seed: wallet.mnemonic.phrase,
              key: wallet.privateKey,
              user: result,
              blockchain: {
                id: 2,
              },
            },
          }
        );

        //console.log("wallet created", walletEntity);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
