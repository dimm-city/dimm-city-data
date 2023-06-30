module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/archives/item-types",
        handler: "archives.getItemTypes",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/archives/search",
        handler: "archives.search",
        config: {
          policies: [],
        },
      },
    ],
  },
};
