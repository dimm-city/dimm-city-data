module.exports = {
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
      {
        method: "GET",
        path: "/chain-contracts",
        handler: "plugin::chain-wallets.chain-contract.find",
        config: {},
      },
    ],
  },
};
