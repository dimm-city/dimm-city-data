"use strict";
module.exports = {
  findOne: async (ctx) => {
    try {
      const releaseKey = ctx.params.release;
      const id = ctx.params.id;

      try {
        const releases = await strapi.entityService.findMany(
          "api::character-release.character-release",
          {
            filters: { slug: releaseKey },
            populate: ["race"],
          }
        );

        if (!releases || releases.length !== 1)
          throw new Error("The release specified cannot be found");

        const release = releases.at(0);

        const service = strapi.service("api::sporos.metadata");
        const output = await service.getCharacterMetadata(release, id);

        ctx.response.set("Content-Type", "application/json");
        ctx.response.set("Cache-Control", "public, max-age=60");
        ctx.response.set("Date", new Date());
        ctx.body = output;

        return output;
      } catch (error) {
        console.error(error);
        if (error.message.indexOf("reverted: 404") > -1) {
          ctx.response.status = 404;
          ctx.body = "Token not found";
        } else {
          ctx.response.status = 500;
          ctx.body = "Failure in dimm city\r\n" + error.message;
        }
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  findContract: async (ctx) => {
    const releaseKey = ctx.params.release;
    const typeKey = ctx.params.type;
    if (typeKey.toLowerCase() === "sporos") {
      const releases = await strapi.entityService.findMany(
        "api::character-release.character-release",
        {
          filters: { slug: releaseKey },
          populate: ["race"],
        }
      );
      if (releases && releases.length == 1) {
        ctx.body = releases[0].metadata;
      } else {
        ctx.response.status = 404;
        ctx.body = {
          message: "unknown contract",
        };
      }
    } else {
      ctx.response.status = 404;
      ctx.body = {
        message: "unknown contract",
      };
    }
  },
};
