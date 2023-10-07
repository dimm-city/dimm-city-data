"use strict";
const { createCoreService } = require("@strapi/strapi").factories;
const { TYPE_TOKEN, NAME_META_EXTENDER } = require("../consts");

const path = require("path");
const fs = require("fs");

async function mergeMetadata(token) {
  let result = token.metadata;

  if (token.contract.entityType) {
    let entities = await strapi.entityService.findMany(token.contract.entityType, {
      filters: {
        token: {
          id: token.id,
        },
      },
    });
    const metaSvc = strapi.services[token.contract.metadataService];

    if (
      entities?.length > 0 &&
      metaSvc[NAME_META_EXTENDER] instanceof Function
    ) {
      const entity = entities.at(0);

      result = await metaSvc[NAME_META_EXTENDER](token, entity);
    }
  }
  return result;
}

/**
 * metadata service
 */

module.exports = createCoreService(TYPE_TOKEN, ({ strapi }) => ({
  async getMetadata(contract, tokenId) {
    let result = { attributes: [] };

    const tokens = await super.find({
      filters: {
        tokenId: tokenId,
        contract: {
          slug: contract,
        },
      },
      populate: "*",
    });

    if (tokens?.results.length > 0) {
      const token = tokens.results.at(0);
      result = (await mergeMetadata(token)) ?? token?.metadata ?? result;
    } else {
      result = null;
    }
    return result;
  },
  async getImage(contract, tokenId) {
    const tokens = await super.find({
      filters: {
        tokenId: tokenId,
        contract: {
          slug: contract,
        },
      },
      populate: "*",
    });

    let token = {};
    if (tokens?.results.length > 0) {
      token = tokens.results.at(0);
    }

    const assetPathBase =
      strapi.plugin("chain-wallets").config("assetPath") ?? ".tokens";

    //ToDo allow for different image loader/strategy
    const imagePath = `${assetPathBase}/${token.contract.slug}/images/${token.tokenId}.png`;

    fs.stat(imagePath, function (err, stat) {
      if (err == null) {
        console.debug("File exists");
      } else if (err.code === "ENOENT") {
        // file does not exist
        console.warn("file does not exist", imagePath);
      } else {
        console.warn("error reading file: ", err.code);
      }
    });

    if (fs.existsSync(imagePath)) return fs.createReadStream(imagePath);
    else return null;
  },
}));
