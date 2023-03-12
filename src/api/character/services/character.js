"use strict";

/**
 * character service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
module.exports = createCoreService("api::character.character");

//TODO: add token refresh after update: https://api.opensea.io/api/v1/asset/<your_contract_address>/<token_id>/?force_update=true