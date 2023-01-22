"use strict";

/**
 * A set of functions called "actions" for `metadata`
 */

async function updateTokens(ctx, next) {
  try {
    const service = strapi.service("plugin::chain-wallets.metadata");
    var result = await service.updateTokens();
    ctx.body = "Testing: " + JSON.stringify(result);
  } catch (err) {
    ctx.body = err;
    ctx.response.status = 500;
    console.log(err);
  }
}

module.exports = {
  index: updateTokens,
};
