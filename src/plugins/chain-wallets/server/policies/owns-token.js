"use strict";

/**
 * WIP: `owns-token` policy
 */

module.exports = async (ctx, config, { strapi }) => {
  // Check to see if any of the current users wallets contain the token.

  //Question: how to get tokenId and contract from an entity specific route?
  const { tokenId, contract } = ctx.params;
  const { user } = ctx.state;
  const tokenSvc = strapi.service("plugin::chain-wallets.chain-token");

  const tokens = await tokenSvc.find({
    filters: {
      tokenId: tokenId,
      contract: { slug: contract },
    },
    populate: "*",
  });

  const token = tokens?.results?.at(0);
  
  console.log(user, token, tokens, tokenId, contract);

  if (!user) {
    strapi.log.info("User not logged in");
    return false;
  }

  if (!token) {
    strapi.log.info(`Token ${contract}-${tokenId} not found`);
    return false;
  }

  const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");
  const wallets = walletSvc.find({
    filters: {
      user: {
        id: user.id,
      },
    },
    populate: "tokens"
  });

  return wallets?.results?.any(w => w.tokens.includes(token));
};
