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
  ],
};
