module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/test",
        handler: "chain-metadata.index",
        config: {
          policies: ["owns-token"],
        },
      },
      {
        method: "GET",
        path: "/metadata/:contract/:tokenId",
        handler: "chain-metadata.getTokenMetadata",
        config: {
          policies: [],
        },
      }
    ],
  },
};
