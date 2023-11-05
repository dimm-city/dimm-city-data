"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::dimm-city.profile",
  ({ strapi }) => ({
    async characters(ctx) {
      const userId = ctx.state?.user?.id;
      const results = await strapi
        .service("plugin::dimm-city.character")
        .find({
          filters: {
            token: {
              wallet: {
                profile: {
                  users: { id: userId },
                },
              },
            },
          },
          populate: "*"
        });
      ctx.send(results);
      //TODO: move this to character controller to get teh correst rest response
    },
  })
);
