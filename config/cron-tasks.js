module.exports = {
  syncContracts: {
    task: ({ strapi }) => {
      console.log("syncing contacts");
    },
    options: {
      rule: "*/10 * * * * *",
    },
  },
};
