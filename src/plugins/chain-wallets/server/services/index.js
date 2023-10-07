"use strict";

const chainToken = require("./token");
const chainWallet = require("./wallet");
const chainContract = require("./contract");
const authentication = require("./authentication");
module.exports = {
  "chain-wallet": chainWallet,
  "chain-token": chainToken,
  "chain-contract": chainContract,
  authentication: authentication,
};
