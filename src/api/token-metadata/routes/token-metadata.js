module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/token-metadata/:type/:release/:id',
     handler: 'token-metadata.findOne',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
