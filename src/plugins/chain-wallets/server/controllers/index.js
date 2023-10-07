const token = require("./token");
const contract = require("./contract");
const wallet = require("./wallet");
const authentication = require("./authentication");
module.exports = {
  "chain-token": token,
  "chain-contract": contract,
  "chain-wallet": wallet,
  authentication: authentication,
};
