"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::dimm-city.profile",
  ({ strapi }) => ({
    async tokens(ctx) {
      const characters = await strapi.entityService.findMany(
        "plugin::dimm-city.character",
        {
          filters: {
            token: {
              wallet: {
                user: { id: ctx.state?.user?.id },
              },
            },
          },
          populate: "*",
        }
      );

      ctx.body = characters;
    },
  })
);
