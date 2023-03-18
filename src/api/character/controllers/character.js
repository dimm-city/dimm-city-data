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
      .find({ paymentId });

    if (false && paymentRecords?.results?.length > 0) {
      throw new Error("Payment has already been processed");
    }
    //const user = payment.metadata.user...populate.wallets
    //const toAddress = user.wallets.find(managed == true).address;

    const slug = "dcta".toUpperCase(); //payment.metadata.slug ?? ;
    const toAddress = "0x8464B5784E857207252BA992a76B77f07a7F96eb"; //payment.metadata.address ?? ;

    const contractSvc = strapi.service("plugin::chain-wallets.chain-contract");
    const tokenId = await contractSvc.mintToken(slug, toAddress);

    const tokens = strapi.service("plugin::chain-wallets.chain-token").find({
      filters: {
        tokenId,
        contract: {
          slug,
        },
      },
      publishStatus: "preview",
    });

    const token = tokens?.results?.at(0); //TODO: token always null

    //mark payment as processed
    await strapi
      .service("api::payment.payment")
      .create({ data: { paymentId, user: ctx.state?.user, token } });

    return { message: "Character created", tokenId: tokenId };
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
