module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/sporos/import/:release/:id',
     handler: 'sporos.import',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'POST',
      path: '/sporos/update/:tokenId',
      handler: 'sporos.update',
      config: {
        policies: [],
        middlewares: [],
      },
     },
  ],
};
