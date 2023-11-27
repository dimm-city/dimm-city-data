/**
 *  character controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::dimm-city.character",
  ({ strapi }) => ({
    async my(ctx) {
      try {
        const userId = ctx.state?.user?.id;

        // // sanitizeQuery to remove any query params that are invalid or the user does not have access to
        // // It is strongly recommended to use sanitizeQuery even if validateQuery is used
        // const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        ctx.query = {
          ...ctx.query,
           filters: {
              token: {
                wallet: {
                  profile: {
                    users: { id: userId },
                  },
                },
              },
            },
          populate: {
            token: true,
            specialties: true,
            mainImage: true,
            currentLocation: true,
            originLocation: true,
            race: true
          },
        }
        return  super.find(ctx);
        // const sanitizedResults = await this.sanitizeOutput(results, ctx);

        // return this.transformResponse(sanitizedResults, { pagination });

        // //TODO: move this to character controller to get teh correst rest response
      } catch (error) {
        ctx.send({ message: "Could not load characters", error: error });
      }
    },
  })
);
