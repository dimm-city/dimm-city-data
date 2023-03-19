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

    //check for processed payment
    const paymentRecords = await strapi
      .service("api::payment.payment")
      .find({ filters: { paymentId: paymentId } });

    if (paymentRecords?.results?.length > 0) {
      throw new Error("Payment has already been processed");
    }

    const contractSvc = strapi.service("plugin::chain-wallets.chain-contract");

    if (!payment.metadata.toAddress) {
      const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");
      const { results } = await contractSvc.find({
        filters: { slug: payment.metadata.slug },
      });

      const contract = results?.at(0);

      const wallet = await walletSvc.getOrCreateUserWallet(
        ctx.state.user,
        contract.chain
      );

      payment.metadata.toAddress = wallet.address;
    }
    const slug = payment.metadata.slug;
    const toAddress = payment.metadata.toAddress;

    const tokenId = await contractSvc.mintToken(slug, toAddress);

    const tokens = await strapi
      .service("plugin::chain-wallets.chain-token")
      .find({
        filters: {
          tokenId,
          contract: {
            slug,
          },
        },
        publicationState: "preview",
      });

    const token = tokens?.results?.at(0);

    //mark payment as processed
    await strapi
      .service("api::payment.payment")
      .create({ data: { paymentId, user: ctx.state?.user, token } });

    return { message: "Character created", tokenId: tokenId, token };
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
