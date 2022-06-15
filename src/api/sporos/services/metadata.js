"use strict";

/**
 * metadata service.
 */

const { streamToBuffer } = require("../lib/streams.js");
const { CharacterStates } = require("../lib/constants");
const { BlobServiceClient } = require("@azure/storage-blob");
const { BigNumber } = require("ethers");
const connStr = process.env.storage_connection;
const container = process.env.metadata_storage_container || "metadata";
const mediaBaseUri =
  process.env.storage_media_uri || "https://data.dimm.city/api/";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);


const mediaTypes = {
  images: "images",
  thumbnails: "thumbnails",
  mp4: "mp4",
};

function formatMediaUrl(mediaType, releaseKey, id) {
  //HACK: fix this!
  let baseUri = process.env.NODE_ENV == "production" ? "https://data.dimm.city/api/" : process.env.storage_media_uri;

  return `${baseUri}/${mediaTypes[mediaType]}/sporos/${releaseKey}/${id}.png`;
}
async function getOriginalTokenMetadata(typeKey, releaseKey, id) {
  const contractService = strapi.service("api::sporos.contracts");
  const supply = await contractService.getTotalSupply(releaseKey);
  if (!isNaN(id) && BigNumber.from(id) > BigNumber.from(supply)) {
    throw new Error("404", {
      statusCode: 404,
    });
  }

  let result = {};

  const containerClient = blobServiceClient.getContainerClient(`${container}`);
  let blobResponse;
  const blobClient = containerClient.getBlobClient(
    `${typeKey}/${releaseKey}/${id}.json`
  );
  blobResponse = await blobClient.download();

  const data = (
    await streamToBuffer(blobResponse.readableStreamBody)
  ).toString();
  result = JSON.parse(data);

  return result;
}

async function getOrCreateTokenData(release, id, publish = false) {
  const typeKey = "sporos";
  const releaseKey = release.slug;
  const tokenId = `${releaseKey}-${id}`;

  const contractService = strapi.service("api::sporos.contracts");
  const isValid = await contractService.isValidToken(releaseKey, id);
  if (!isValid) throw new Error("404", { statusCode: 404 });

  let token;
  const tokens = await strapi.entityService.findMany("api::token.token", {
    filters: {
      tokenId,
    },
  });

  if (!tokens || tokens.length === 0) {
    //Does token exist in db, if not create it

    let metadata = await getOriginalTokenMetadata(typeKey, releaseKey, id);

    //ToDo: add link to WebGL card and link to token on dimm.city
    //metadata.animation_url = "WebGL url";
    //metadata.external_url = `https://dimm.city/${typeKey}/${releaseKey}/${metadata.edition}`;

    //ToDo: use files.dimm.city once automated image protection is built
    metadata.image = formatMediaUrl(mediaTypes.images, releaseKey, id); // `${releaseMediaUri}/${metadata.edition}.png`;
    metadata.thumbnail_uri = formatMediaUrl(
      mediaTypes.thumbnails,
      releaseKey,
      id
    );
    //`${releaseMediaUri}/thumbnail/${metadata.edition}.png`;
    metadata.compiler = "Daemon";
    delete metadata.fullresulotion_uri;

    token = await strapi.entityService.create("api::token.token", {
      data: {
        tokenId: tokenId,
        metadata: metadata,
        release: release.id,
        publishedAt: publish ? new Date() : null,
      },
    });
  } else {
    token = tokens[0];
  }

  return token;
}

async function getMergedMetadata(release, id) {
  let token = await getOrCreateTokenData(release, id, true);

  let output = token.metadata;

  output.image = formatMediaUrl(mediaTypes.images, release.slug, id);
  output.thumbnail_uri = formatMediaUrl(mediaTypes.thumbnails, release.slug, id);

  if (output.animation_url) {
    output.animation_url = formatMediaUrl(mediaTypes.mp4, release.slug, id);
  }

  const entries = await strapi.entityService.findMany(
    "api::character.character",
    {
      filters: { tokenId: `${release.slug}-${id}` },
      populate: "*",
    }
  );

  const character = entries.at(0);
  if (character && character.publishedAt) {
    output.name = character.name;
    output.dreams = character.dreams;
    output.description = character.vibe;
    output.hasCharacter = true;
    //TODO: complete character attributes
    //Tweak metadata for more robust support
    //https://docs.opensea.io/docs/metadata-standards
    output.attributes.push({
      value: character.hp,
      trait_type: "HP",
      display_type: "boost_number",
    });
    output.attributes.push({
      value: character.ap,
      trait_type: "AP",
      display_type: "boost_number",
    });
  } else {
    output.hasCharacter = false;
  }

  return output;
}

module.exports = () => ({
  async getCharacterMetadata(release, id) {
    const releaseKey = release.slug;
    let state = CharacterStates.Unminted;

    const contractService = strapi.service("api::sporos.contracts");
    const isValid = await contractService.isValidToken(releaseKey, id);

    if (isValid) {
      state = await contractService.getTokenState(release.slug, id);
    }

    let output = {};

    switch (state) {
      case CharacterStates.Alive:
        output = await getMergedMetadata(release, id);

        break;
      case CharacterStates.Annihilated:
        Object.assign(output, {
          description: "This Sporo can no longer be contacted.",
          image: formatMediaUrl(mediaTypes.images, release.slug, 'destroyed'),
          attributes: [],
        });
        break;
      case CharacterStates.Ethereal:
        output = require("../lib/metadata/etheral.json");
        break;
      case CharacterStates.Lost:
        Object.assign(output, {
          description: "Has been lost in the ether...",
          image: formatMediaUrl(mediaTypes.images, release.slug, "lost"),
          attributes: [],
        });
        break;
      case CharacterStates.Unminted:
        output = require("../lib/metadata/pack.json");
        output.attributes = [
          {
            trait_type: "Status",
            value: "Unminted",
          },
        ];
        break;
      case CharacterStates.Unopened:
        output = require("../lib/metadata/pack.json");
        break;
      default:
        break;
    }

    // output.attributes = output.attributes
    //   ? output.attributes.filter((a) => a.trait_type != "Outline")
    //   : [];

    output.state = state;
    output.compiler = "Daemon";

    delete output.fullresulotion_uri;
    return output;
  },
  getOrCreateTokenData,
});
