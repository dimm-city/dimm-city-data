"use strict";

/**
 * character router.
 */
const { createCoreRouter } = require("@strapi/strapi").factories;
module.exports = createCoreRouter("api::character.character", {
  only: ["find", "findOne", "update", "create"],
  config: {
    update: {
      policies: ["owns-token"],
    },
  },
});
