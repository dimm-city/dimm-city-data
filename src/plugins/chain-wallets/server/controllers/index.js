'use strict';

const metadata = require('./metadata');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = {
  "chain-metadata": metadata,
  "chain-token": createCoreController('plugin::chain-wallets.chain-token'),
  "chain-contract": createCoreController('plugin::chain-wallets.chain-contract'),
  "chain-wallet": createCoreController('plugin::chain-wallets.chain-wallet'),
};
