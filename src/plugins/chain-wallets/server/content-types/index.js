"use strict";

const token = require("./token");
const wallet = require("./wallet/schema.json");
const contract = require("./contract/schema.json");
module.exports = {
  "chain-token": token,
  "chain-contract": {
    schema: contract,
  },
  "chain-wallet": {
    schema: wallet,
  }
};
