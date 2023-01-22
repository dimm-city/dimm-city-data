const { createCoreRouter } = require('@strapi/strapi').factories;
const contract = require('./chain-contract');
module.exports = {
  //"chain-contract": contract,
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/test",
        handler: "metadata.index",
        config: {
          policies: [],
        },
      },
    ],
  },
};
