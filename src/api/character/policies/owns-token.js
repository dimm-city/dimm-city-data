"use strict";

module.exports = async (ctx, config, { strapi }) => {
  // Check to see if any of the current users wallets contain the token.
  const { user } = ctx.state;
  if (!user) {
    strapi.log.info("User not logged in");
    return false;
  }
  try {
    const { id } = ctx.params;
    const svc = strapi.service("api::character.character");

    const entity = await svc.findOne(id, {
      filters: {
        token: {
          wallet: {
            user: {
              id: user.id,
            },
          },
        },
      },
      populate: "*",
    });

    if (entity?.id < 1) {
      strapi.log.info(`Entity not found`);
      return false;
    }

    const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");
    const wallets = await walletSvc.getUserWallets(ctx.state?.user);

    const result = wallets?.results?.some((w) =>
      w.tokens.some((t) => t.id == entity?.token?.id)
    );
    return result;
  } catch (error) {
    strapi.log.error(error);
    return false;
  }
};
