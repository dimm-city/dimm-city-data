"use strict";

/**
 * metadata service
 */

module.exports = ({ strapi }) => ({
  updateTokens() {
    console.log("updating tokens", strapi.cron);
    return "Tokens updated";
  },
});
