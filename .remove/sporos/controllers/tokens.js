"use strict";

/**
 * A set of functions called "actions" for `tokens`
 */

module.exports = {
  async findOne(ctx) {
    const releaseKey = ctx.params.release;
    const typeKey = ctx.params.type || "sporos";
    const id = ctx.params.id;
    ctx.params.id = `${releaseKey}-${id}`;
    console.warn("starting", typeKey, releaseKey, id);

    //ToDo: check contract and display state based response

    const entries = await strapi.entityService.findMany("api::token.token", {
      filters: { tokenId: `${releaseKey}-${id}` },
      populate: "*",
    });
    let token = entries.at(0);

    //! ToDo: Check if token is minted...

    const result = formatToken(token);
    return result;
  },
  userTokens: async (ctx, next) => {
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: { id: ctx.state.user.id },
      populate: {
        role: true,
        wallets: true,
        settings: { populate: { wallet: true } },
      },
    });
    const service = strapi.service("api::sporos.contracts");
    const tokens = await service.getTokensForWallet(
      user.settings.wallet.address
    );
    return tokens.map(t => formatToken(t));
  },
  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
};
function formatToken(token) {
  token = Object.assign(token, token.metadata);
  //const character = entries.at(0);
  if (token.character) {
    console.warn("merge character");
    delete token.character.createdAt;
    delete token.character.updatedAt;
    delete token.character.publishedAt;
    delete token.character.createdBy;
    delete token.character.updatedBy;
    delete token.character.publishedBy;
    delete token.character.tokenId;
    token = Object.assign(token, token.character);
    //   token.eyes = token.attributes.eyes;
    delete token.character;
  }

  delete token.createdAt;
  delete token.updatedAt;
  delete token.publishedAt;
  delete token.createdBy;
  delete token.updatedBy;
  delete token.publishedBy;
  delete token.metadata;
  delete token.release;
  return token;
}
