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
            race: true,
            inventory:{
              populate: {
                item: true
              }
            }
          },
        };
        return super.find(ctx);
      } catch (error) {
        ctx.send({ message: "Could not load characters", error: error });
      }
    },
    async addAbility(ctx) {
      const characterId = ctx.params.id;
      const abilityId = ctx.params.ability;

      const service = strapi.services["plugin::dimm-city.character"];

      return await service.update(characterId, {
        data: {
          selectedAbilities: {
            connect: [abilityId],
          },
        },
      });
    },
    async removeAbility(ctx) {
      const characterId = ctx.params.id;
      const abilityId = ctx.params.ability;

      return await strapi.services["plugin::dimm-city.character"].update(
        characterId,
        {
          data: {
            selectedAbilities: {
              disconnect: [abilityId],
            },
          },
        }
      );
    },
  })
);
