const { TYPE_WALLET } = require("../consts");

async function attachUserWallet(ctx) {
  try {
    if (ctx.state.user?.id == null)
      throw new Error(
        "You must be logged in to attach a wallet to your account."
      );
    const { network } = ctx.params;

    const signature = ctx.header.sig;
    const service = strapi.service(TYPE_WALLET);
    const message = "Attach this wallet";
    const address = service.getSigner(message, signature);
    const wallet = await service.getOrCreateWallet(network, address);
    let result = {
      error: "Failed to attach wallet.",
    };
    if (address) //ToDo: ensure the wallet is not attached to another account
      result = await service.attachUserWallet(wallet, ctx.state.user);

    ctx.body = result;
  } catch (error) {
    ctx.body = error;
    ctx.response.status = 500;
    strapi.log.error(error);
  }
}

async function detachUserWallet(ctx) {
  try {
    if (ctx.state.user?.id == null)
      throw new Error(
        "You must be logged in to detach a wallet to your account."
      );
    const { address, network } = ctx.params;

    const service = strapi.service(TYPE_WALLET);
    const wallet = await service.getOrCreateWallet(network, address);
    let result = {
      error: "Failed to detach wallet.",
    };
    if (wallet?.user?.id === ctx.state.user.id)
      result = await service.detachUserWallet(wallet, ctx.state.user);

    ctx.body = result;
  } catch (error) {
    ctx.body = error;
    ctx.response.status = 500;
    strapi.log.error(error);
  }
}

async function getUserWallets(ctx) {
  try {
    if (ctx.state.user?.id == null)
      throw new Error(
        "You must be logged in to retrieve the wallets for your account."
      );
    const service = strapi.service(TYPE_WALLET);
    const wallets = await service.getUserWallets(ctx.state.user);

    return wallets;
  } catch (error) {
    ctx.body = error;
    ctx.response.status = 500;
    strapi.log.error(error);
  }
}

module.exports = {
  attachUserWallet,
  detachUserWallet,
  getUserWallets,
};
