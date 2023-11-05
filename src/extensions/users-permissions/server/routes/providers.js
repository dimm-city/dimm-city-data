module.exports = [
  {
    method: "GET",
    path: `/auth/providers`,
    handler: `providers.find`,
    config: {
      prefix: "",
    },
  },
];
