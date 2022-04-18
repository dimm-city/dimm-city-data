"use strict";

const { ethers } = require("ethers");

async function importTokenDataToCharacter(character, releaseKey, id) {
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

  //set race
  character.race = release.race;

  const service = strapi.service("api::sporos.metadata");
  const token = await service.getOrCreateTokenData(release, id);
  character.tokenId = token.tokenId;
  character.token = token.id;

  //set fields from attributes
  character.name = character.name || token.name;
  character.eyes = _getAttributeValue(token.metadata, "eyes");
  character.clothing = _getAttributeValue(token.metadata, "clothing");
  character.skin = _getAttributeValue(token.metadata, "body");

  //set images
  character.imageUrl = token.metadata.image;
  character.thumbnailUrl = token.metadata.thumbnail_uri;

  //TODO: set items
}

// async function getOrCreateTokenData(release, id) {
//   const tokenId = `${release.slug}-${id}`;
//   let token;
//   const tokens = await strapi.entityService.findMany("api::token.token", {
//     filters: {
//       tokenId,
//     },
//   });

//   if (!tokens || tokens.length === 0) {
//     //Does token exist in db, if not create it

//     const service = strapi.service("api::sporos.metadata");
//     let metadata = await service.getTokenMetadata(
//       "sporos",
//       release.slug.replace("dc", ""),
//       id
//     );

//     //const token = character.token;
//     token = await strapi.entityService.create("api::token.token", {
//       data: {
//         tokenId: tokenId,
//         metadata: metadata,
//         release: release.id,
//       },
//     });

//   } else {
//     token = tokens[0];
//   }
//   return token;
// }

function getSigner(ctx) {
  const message = ctx.header.authorization;
  const signer = ethers.utils.verifyMessage(
    "Sign this message to connect to your Dimm City profile.",
    message
  );

  if (!message || !signer) throw new Error("Not authorized");

  return signer;
}

function _getAttributeValue(token, attribKey) {
  const result = token.attributes.find(
    (a) => a.trait_type.toLowerCase() == attribKey.toLowerCase()
  );
  return result ? result.value : "";
}

module.exports = {
  canEdit: async (ctx, next) => {
    const releaseKey = ctx.params.release?.toLowerCase();
    const id = ctx.params.id;

    console.log("canEdit-ctrl", releaseKey, id);
    const signer = getSigner(ctx);

    const service = strapi.service("api::sporos.contracts");

    return await service.canEditToken(signer, releaseKey, id);
  },
  import: async (ctx, next) => {
    try {
      const releaseKey = ctx.params.release?.toLowerCase();
      const id = ctx.params.id;

      const { signer } = getSigner(ctx);

      //TODO: check ownership && state
      const service = strapi.service("api::sporos.contracts");
      const canEdit = await service.canEditToken(signer, releaseKey, id);
      if (!canEdit)
        throw new Error("You are not authorized to edit this character");
      //if (!message || !signer || !owner || !alive) throw new Error("Not authorized");

      const character = ctx.request.body;

      //set defaults
      if (character.pronouns <= "") character.pronouns = "they/them";
      if (character.height <= 0 || character.height > 5) character.height = 1.2;
      if (character.weight < 1 || character.weight > 100) character.weight = 27;
      if (character.age < 1) character.age = 23;
      character.ap = 10;
      character.hp = 10;

      await importTokenDataToCharacter(character, releaseKey, id);

      //publish records
      //ToDo: re-enable for release: character.publishedAt = new Date();

      const result = await strapi.entityService.create(
        "api::character.character",
        { data: character }
      );

      ctx.body = result;
    } catch (err) {
      console.error(err);
      ctx.body = JSON.stringify(err);
      ctx.response.status = 500;
    }
  },
  update: async (ctx, next) => {
    try {
      const releaseKey = ctx.params.release?.toLowerCase();
      const id = ctx.params.id;

      const signer = getSigner(ctx);

      const characters = await strapi.entityService.findMany(
        "api::character.character",
        {
          filters: { tokenId: `${releaseKey}-${id}` },
          populate: "*",
        }
      );

      const currentData = characters.at(0);

      if (!currentData || !currentData.token)
        throw new Error("No token associated with this character");

      const service = strapi.service("api::sporos.contracts");

      const canEdit = await service.canEditToken(
        signer,
        currentData.token.metadata.release.toLowerCase(),
        currentData.token.metadata.edition
      );
      if (!canEdit)
        throw new Error("You are not authorized to edit this character");

      //TODO: check ownership && state

      const character = ctx.request.body;

      //set defaults
      if (character.pronouns <= "") character.pronouns = "they/them";
      if (character.height <= 0 || character.height > 5) character.height = 1.2;
      if (character.weight < 1 || character.weight > 100) character.weight = 27;
      if (character.age < 1) character.age = 23;

      const result = await strapi.entityService.update(
        "api::character.character",
        character.id,
        {
          data: {
            name: character.name,
            age: character.age,
            pronouns: character.pronouns,
            height: character.height,
            weight: character.weight,
            vibe: character.vibe,
            beliefs: character.beliefs,
            flaws: character.flaws,
            dreams: character.dreams,
            backstory: character.backstory,
            created_by_id: currentData.created_by_id,
            updatedAt: new Date(),
          },
        }
      );

      ctx.body = result;
    } catch (err) {
      console.error(err);
      ctx.body = JSON.stringify(err);
      ctx.response.status = 500;
    }
  },
};
