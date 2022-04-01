"use strict";

const { ethers } = require("ethers");

/**
 * A set of functions called "actions" for `sporos`
 */

module.exports = {
  import: async (ctx, next) => {
    try {
      const releaseKey = ctx.params.release;
      const id = ctx.params.id;

      const message = ctx.header.authorization;
      const signer = ethers.utils.verifyMessage(
        "Sign this message to connect to your Dimm City profile.",
        message
      );

      //check ownership
      //check state

      if (!message || !signer) throw new Error("Not authorized");

      const releases = await strapi.entityService.findMany(
        "api::character-release.character-release",
        {
          filters: { slug: releaseKey },
          populate: ['race'],
        }
      );
      const release = releases.at(0);

      const character = ctx.request.body;

      character.tokenId =
        character.token.release + "-" + character.token.edition;
      //set token
      const t = await strapi.entityService.create("api::token.token", {
        data: {
          tokenId: character.tokenId,
          metadata: character.token,
          release: release.id,
        },
      });
      character.token = t.id;

      if (character.pronouns <= "") character.pronouns = "they/them";
      if (character.height <= 0 || character.height > 5) character.height = 1.2;
      if (character.weight < 1 || character.weight > 100) character.weight = 27;
      if (character.age < 1) character.age = 23;

      character.ap = 10;
      character.hp = 10;
      //set race
      character.race = release.race;

      //set items
      //set fields from attributes
      //set image

      // if (character.currentLocation?.slug > "") {
      //   const location = await strapi.entityService.findMany(
      //     "api::location.location",
      //     {
      //       filters: { slug: character.currentLocation.slug },
      //     }
      //   );

      const result = await strapi.entityService.create(
        "api::character.character",
        { data: character }
      );

      //publish records

      ctx.body = result;
    } catch (err) {
      console.error(err);
      ctx.body = JSON.stringify(err);
      ctx.response.status = 500;
    }
  },
};
