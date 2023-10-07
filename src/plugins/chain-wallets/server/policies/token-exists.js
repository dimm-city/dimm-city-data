"use strict";

const { TYPE_TOKEN } = require("../consts");

/**
 * `token-exists` policy
 */
// Check to see if token has been minted.
module.exports = async (ctx, config, { strapi }) => {
  //Question: how to get tokenId and contract from an entity specific route?
  const { tokenId, contract } = ctx.params;
  const tokenSvc = strapi.service(TYPE_TOKEN);

  const tokens = await tokenSvc.find({
    filters: {
      tokenId: tokenId,
      contract: { slug: contract },
    },
    populate: "*",
  });

  return tokens?.results?.length > 0;
};
