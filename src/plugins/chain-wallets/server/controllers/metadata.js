"use strict";

/**
 * A set of functions called "actions" for `metadata`
 */

async function updateTokens(ctx, next) {
  try {
    console.time("updateTokens");
    const service = strapi.service("plugin::chain-wallets.metadata");
    var result = await service.syncWallets();
    console.timeEnd("updateTokens");
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
