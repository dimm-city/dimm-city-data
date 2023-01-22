'use strict';

const metadata = require('./metadata');
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = {
  metadata,
  'chain-network': createCoreService('plugin::chain-wallets.chain-network'),
  'chain-wallet': createCoreService('plugin::chain-wallets.chain-wallet'),
  'chain-token': createCoreService('plugin::chain-wallets.chain-token'),
  'chain-contract': createCoreService('plugin::chain-wallets.chain-contract')
};
