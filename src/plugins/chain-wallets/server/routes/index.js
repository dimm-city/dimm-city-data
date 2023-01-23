module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/test",
        handler: "metadata.index",
        config: {
          policies: ["owns-token"],
        },
      },
      {
        method: "GET",
        path: "/metadata/:contract/:tokenId",
        handler: "metadata.getTokenMetadata",
        config: {
          policies: [],
        },
      }
    ],
  },
};
