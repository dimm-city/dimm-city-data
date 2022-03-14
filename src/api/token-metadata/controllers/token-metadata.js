"use strict";
const { getCharacterMetadata } = require("../lib/CharacterData");
//const { strapi } = require("@strapi/strapi");
/**
 * A set of functions called "actions" for `token-metadata`
 */

module.exports = {
  findOne: async (ctx) => {
    try {
      const releaseKey = ctx.params.release;
      const typeKey = ctx.params.type || "sporos";
      const id = ctx.params.id; 
      console.warn("starting", typeKey, releaseKey, id);
   
      try {
        let output = await getCharacterMetadata(typeKey, releaseKey, id);

        ctx.response.set("content-type", "application/json");

        const entries = await strapi.entityService.findMany(
          "api::character.character",
          {
            filters: { tokenId: `${output.release}-${id}` },
            populate: "*",
          }
        );

        const character = entries.at(0);

        //ctx.body = Object.assign(output, character);
        console.warn("get character", typeKey, releaseKey, id);
   
        if (character) {
          console.warn("merge character", typeKey, releaseKey, id);
   
          output.name = character.name;
        }

        ctx.body = output;
        
        return output;
      } catch (error) {
        console.error(error);
        if (error.message.indexOf("reverted: 404") > -1) {
          ctx.response.status = 404;
          ctx.body = "Token not found";
        } else {
          ctx.response.status = 500;
          ctx.body = "Failure in dimm city";
        }
      }
    } catch (err) {
      ctx.body = err;
    }
    
  },
};
