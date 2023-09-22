module.exports = [
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
];
