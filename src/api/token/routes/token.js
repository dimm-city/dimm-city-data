'use strict';

/**
 * token router.
 */

// const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::token.token');
module.exports = {
    routes: [
      {
       method: 'GET',
       path: '/token/:type/:release/:id',
       handler: 'token.findOne',
       config: {
         policies: [],
         middlewares: [],
       },
      },
    ],
  };
  