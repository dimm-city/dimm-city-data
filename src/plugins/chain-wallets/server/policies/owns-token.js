"use strict";

/**
 * `owns-token` policy
 */

module.exports = async (ctx, config, { strapi }) => {
  // Add your own logic here.

  const { tokenId, contract } = ctx.params;
  const { user } = ctx.state;
  const tokenSvc = strapi.service("plugin::chain-wallets.chain-token");

  const tokens = await tokenSvc.find({
    filter: {
      tokenId: tokenId,
      contract: { slug: contract },
    },
    populate: "*",
  });
  console.log(user, tokens, tokenId, contract);

  if (!user) {
    strapi.log.info("User not logged in");
    return false;
  }

  const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");
  const userSvc = strapi.service("plugin::users-permissions.user");

  strapi.log.info("In owns-token policy.");

  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
