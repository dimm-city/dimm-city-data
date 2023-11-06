const { createCoreService } = require("@strapi/strapi").factories;
const ethers = require("ethers");
const { getNetwork } = require("@ethersproject/networks");
const { TYPE_WALLET } = require("../consts");

module.exports = createCoreService(TYPE_WALLET, (ctx) => ({
  async attachUserWallet(wallet, user) {
    wallet.profile = user.profile;
    await super.update(wallet.id, { data: wallet });
  },
  async detachUserWallet(wallet) {
    wallet.profile = null;
    await super.update(wallet.id, { data: wallet });
  },
  async createManagedUserWallet(user, chain) {
    const network = getNetwork(chain);
    const wallet = ethers.Wallet.createRandom();

    const walletEntity = await super.create({
      data: {
        managed: true,
        primary: true,
        address: wallet.address,
        seed: wallet.mnemonic.phrase,
        key: wallet.privateKey,
        encKey: wallet.privateKey,
        profile: user.profile,
        chain: network.name,
      },
    });
    return walletEntity;
  },
  async getOrCreateWallet(chain, address) {
    if (!isNaN(chain)) chain = Number(chain);
    const network = getNetwork(chain);
    const { results } = await super.find({
      filters: {
        address,
        chain: network.name,
      },
      populate: {
        user: true,
      },
    });
    if (results?.length === 1) {
      return results.at(0);
    }
    return await super.create({
      data: {
        address,
        chain: network.name,
        managed: false,
      },
    });
  },
  getSigner(message, signature) {
    const signer = ethers.utils.verifyMessage(message, signature);

    if (!message || !signer) return null;

    return signer;
  },
  async getOrCreateUserWallet(user, chain) {
    const wallets = await super.find({
      filters: {
        profile: { id: user.profile.id },
        chain,
      },
      fields: ["id", "address", "chain", "name", "managed", "primary"],
      populate: {
        tokens: {
          fields: ["id", "tokenId", "metadata"],
          populate: {
            contract: {
              fields: ["id", "name", "slug", "entityType", "address", "chain"],
            },
          },
        },
      },
    });

    let wallet = wallets.results
      .filter((w) => w.chain == chain)
      .sort((a, b) => (a.primary ? 1 : -1))
      .at(0);

    if (!wallet) wallet = await this.createManagedUserWallet(user, chain);

    return wallet;
  },
  async getUserWallets(user) {
    const userId = user.id;
    // const wallets  = await strapi.db.query(TYPE_WALLET).findMany({
    //   where: {
    //     profile: {
    //       users: { id: userId },
    //     },
    //   },
    //   populate: { tokens: true },
    // });

     const wallets = await strapi.service(TYPE_WALLET).findMany({
       where: {
         profile: {
           users: { id: userId },
         },
       },
       populate: { tokens: true },
     });

    return wallets;
  },
}));
