module.exports = [
  {
    method: "GET",
    path: "/stats",
    handler: "stats.getStats",
    config: {
      policies: [],
    },
  },
];
