"use strict";

const metadata = require("./metadata");
const chainWallet = require('./wallet');
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = {
  "chain-metadata": metadata,
  "chain-network": createCoreService("plugin::chain-wallets.chain-network"),
  "chain-wallet": chainWallet,
  "chain-token": createCoreService("plugin::chain-wallets.chain-token"),
  "chain-contract": createCoreService("plugin::chain-wallets.chain-contract"),
};
