"use strict";

/**
 *  controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::dimm-city.profile",
  ({ strapi }) => ({
    async characters(ctx) {
      try {
        const userId = ctx.state?.user?.id;

        // sanitizeQuery to remove any query params that are invalid or the user does not have access to
        // It is strongly recommended to use sanitizeQuery even if validateQuery is used
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const { results, pagination } = await strapi
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
            populate: "*",
          });
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults, { pagination });

        //TODO: move this to character controller to get teh correst rest response
      } catch (error) {
        ctx.send({ message: "Could not load characters", error: error });
      }
    },
  })
);
