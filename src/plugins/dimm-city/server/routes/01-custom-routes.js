const faction = require("./faction");
module.exports =
{
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/factions",
        handler: "faction.find",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/stats",
        handler: "stats.getStats",
        config: {
          policies: [],
        },
      },
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
