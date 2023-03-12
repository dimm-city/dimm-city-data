const { config: prod } = require("./config.prod");
const { config: staging } = require("./config.staging");

const config =  prod; // getCurrentConfig();

function getCurrentConfig() {
  if (process.env && process.env.NODE_ENV === "production") return prod;
  return staging;
}

module.exports = { config };
