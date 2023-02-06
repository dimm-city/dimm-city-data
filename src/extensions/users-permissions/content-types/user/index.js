//https://forum.strapi.io/t/strapi-create-new-user-users-permissions-plugin-lifecycles/13386/5
const schema = require("./schema.json");

module.exports = {
  schema,
  lifecycles: {
    async afterCreate(event) {
      const { result } = event;
      try {
        const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");
        walletSvc.createUserWallet(1, result);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
