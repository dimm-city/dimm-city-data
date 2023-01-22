module.exports = {
  syncContracts: {
    task: ({ strapi }) => {
      console.log("chain wallets contacts");
    },
    options: {
      rule: "*/10 * * * * *",
    },
  },
};
