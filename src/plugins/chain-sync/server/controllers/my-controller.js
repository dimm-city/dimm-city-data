'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('chain-sync')
      .service('myService')
      .getWelcomeMessage();
  },
});
