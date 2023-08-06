//https://forum.strapi.io/t/strapi-create-new-user-users-permissions-plugin-lifecycles/13386/5
const schema = require("./schema.json");

module.exports = {
  schema
  //,
  // lifecycles: {
  //   async afterCreate(event) {
  //     const { result } = event;
  //     try {
  //       await strapi.plugins["chain-wallets"].services[
  //         "chain-wallet"
  //       ].createManagedUserWallet(result, "mainnet");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // },
};
