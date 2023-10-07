"use strict";

const { TYPE_TOKEN, TYPE_WALLET } = require("../consts");

/**
 * WIP: `owns-token` policy
 */

module.exports = async (ctx, config, { strapi }) => {
  // Check to see if any of the current users wallets contain the token.
  const { user } = ctx.state;
  if (!user) {
    strapi.log.info("User not logged in");
    return false;
  }
  try {
    //Question: how to get tokenId and contract from an entity specific route?
    const { tokenId, contract, id } = ctx.params;
    const tokenSvc = strapi.service(TYPE_TOKEN);

    const { results } = await tokenSvc.find({
      filters: {
        $or: [
          {
            tokenId: tokenId,
            contract: { slug: contract },
          },
          {
            id: id,
          },
        ],
      },
      populate: "*",
    });

    const token = results?.at(0);

    if (
      token?.id < 1 ||
      token?.tokenId != tokenId ||
      token?.contract?.slug != contract
    ) {
      strapi.log.info(`Token not found`);
      return false;
    }

    const walletSvc = strapi.service(TYPE_WALLET);
    const wallets = await walletSvc.getUserWallets(
      ctx.state?.user ?? { id: -1 }
    );

    const result = wallets?.results?.some((w) =>
      w.tokens.some((t) => t.id == token.id)
    );
    return result;
  } catch (error) {
    strapi.log.error(error);
    return error;
  }
};
