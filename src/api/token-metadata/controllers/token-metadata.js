"use strict";
const { getCharacterMetadata } = require("../lib/CharacterData");

/**
 * A set of functions called "actions" for `token-metadata`
 */

module.exports = {
  findOne: async (ctx, next) => {
    console.log("hello", JSON.stringify(ctx));
    try {
      const releaseKey = ctx.params.release;
      const typeKey = ctx.params.type || "sporos";
      const id = ctx.params.id;
      try {
        let output = await getCharacterMetadata(typeKey, releaseKey, id);
        
        ctx.response.set("content-type", "application/json");
        ctx.body = output;
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
