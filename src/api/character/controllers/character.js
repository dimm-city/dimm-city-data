const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { ethers } = require("ethers");
/**
 *  character controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

async function characterPurchased(ctx) {
  try {
    const { paymentId } = ctx.params;

    // Retrieve the payment object from Stripe
    const payment = await stripe.paymentIntents.retrieve(paymentId);

    // Verify that the payment was successful
    if (payment.status !== "succeeded") {
      throw new Error(`Payment ${paymentId} was not successful`);
    }

    const contractSvc = strapi.service("plugin::chain-wallets.chain-contract");
    const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");

    //const user = payment.metadata.user...populate.wallets
    payment.metadata.slug = "dcta";
    const contracts = await contractSvc.find({
      filters: { slug: payment.metadata.slug },
    });
    const contract = contracts.results.at(0);
    const adminWallet = await walletSvc.find({
      filters: {
        address: "0x8464B5784E857207252BA992a76B77f07a7F96eb",
        chain: contract.chain,
      },
    });
    const smartContract = await contractSvc.getSmartContract(
      contract,
      adminWallet.results.at(0)
    );
    //const address = user.wallets.find(managed == true).address;
    await smartContract.safeMint(
      payment.metadata.address ?? "0x8464B5784E857207252BA992a76B77f07a7F96eb",
      ""
    );
    await contractSvc.syncContract(contract);

    //mark payment as processed
    //return tokenId

    return { message: "Character created" };
  } catch (err) {
    console.error(err);
    return ctx.badRequest(`Error minting token: ${err.message}`);
  }
}

module.exports = createCoreController("api::character.character", () => ({
  //   find: super.find,
  //   findOne: super.finOne,
  //   update: super.update,
  characterPurchased,
}));
