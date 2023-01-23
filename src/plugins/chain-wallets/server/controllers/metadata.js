"use strict";

/**
 * A set of functions called "actions" for `metadata`
 */
async function getTokenMetadata(ctx, next) {
  const { tokenId, contract } = ctx.params;
  const service = strapi.service("plugin::chain-wallets.chain-metadata");
  let result = await service.mergeMetadata(tokenId, contract);
  if(result){
    ctx.body = result;
  } else {
    ctx.response.statusCode = 404;
  }
}


async function updateTokens(ctx, next) {
  try {
    console.time("updateTokens");
    const service = strapi.service("plugin::chain-wallets.chain-metadata");
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
  getTokenMetadata: getTokenMetadata,
};
