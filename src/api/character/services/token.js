// "use strict";

// /**
//  *  token controller
//  */

// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::token.token", ({ strapi }) => ({
//   async findOne(ctx) {
//     const releaseKey = ctx.params.release;
//     const typeKey = ctx.params.type || "sporos";
//     const id = ctx.params.id;
//     ctx.params.id = `${releaseKey}-${id}`;
//     console.warn("starting", typeKey, releaseKey, id);

//     //ToDo: check contract and display state based response

//     const entries = await strapi.entityService.findMany("api::token.token", {
//       filters: { tokenId: `${releaseKey}-${id}` },
//       populate: "*",
//     });
//     let token = entries.at(0);

//     //! ToDo: Check if token is minted...

//     token = Object.assign(token, token.metadata);
//     //const character = entries.at(0);
//     if (token.character) {
//       console.warn("merge character", typeKey, releaseKey, id);
//       delete token.character.createdAt;
//       delete token.character.updatedAt;
//       delete token.character.publishedAt;
//       delete token.character.createdBy;
//       delete token.character.updatedBy;
//       delete token.character.publishedBy;
//       delete token.character.tokenId;
//       token = Object.assign(token, token.character);
//       //   token.eyes = token.attributes.eyes;

//       delete token.character;
//     }

//     delete token.createdAt;
//     delete token.updatedAt;
//     delete token.publishedAt;
//     delete token.createdBy;
//     delete token.updatedBy;
//     delete token.publishedBy;
//     delete token.metadata;
//     delete token.release;

//     return token;
//   },
// }));
