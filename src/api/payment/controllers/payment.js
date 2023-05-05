"use strict";

/**
 * payment controller
 */
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { ethers } = require("ethers");
const { createCoreController } = require("@strapi/strapi").factories;

async function createPaymentIntent(ctx) {
  const { metadata } = ctx.request.body;
  // create the payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "usd",
    payment_method_types: ["card"],
    metadata,
  });

  // return the clientSecret to the client
  return { clientSecret: paymentIntent.client_secret };
}

async function purchaseCompleted(ctx) {
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

    return { message: "Payment processed", tokenId: tokenId, token };
  } catch (err) {
    console.error(err);
    return ctx.badRequest(`Error minting token: ${err.message}`);
  }
}

module.exports = createCoreController("api::payment.payment", () => ({
  createPaymentIntent,
  purchaseCompleted,
}));
