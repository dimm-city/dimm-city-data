"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::dimm-city.profile",
  ({ strapi }) => ({
    async characters(ctx) {
      const characters = await strapi
        .service("plugin::dimm-city.character")
        .find({
          filters: {
            token: {
              wallet: {
                user: { id: ctx.state?.user?.id },
              },
            },
          },
        });

      ctx.query = {
        filters: {
          id: {
            $in: characters.results.map((c) => c.id),
          },
        },
        populate: "*",
      };
      const results = await strapi
        .controller("plugin::dimm-city.character")
        .find(ctx);

      ctx.body = results;
    },
  })
);
