const { TYPE_CONTRACT } = require("../consts");

module.exports = {
  syncContracts: {
    task: ({ strapi }) => {
      const label = `Sync contracts: ${Date.now()}`;
      console.time(label);
      const service = strapi.service(TYPE_CONTRACT);
      service.syncContracts().then((result) => {
        console.timeEnd(label);
      });
    },
    options: {
      rule: "*/30 * * * * *",
    },
  },
};
