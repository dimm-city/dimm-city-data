"use strict";

/**
 * metadata service.
 */

const { streamToBuffer } = require("../lib/streams.js");
const { BlobServiceClient } = require("@azure/storage-blob");
const connStr = process.env.storage_connection;
const container = process.env.metadata_storage_container || "metadata";
const mediaBaseUri =
  process.env.storage_media_uri || "https://sporosnft.io/api/v1/media";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

async function getOriginalTokenMetadata(typeKey, releaseKey, id) {
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

module.exports = () => ({
  async getOrCreateTokenData(release, id) {
    const typeKey = "sporos";
    const releaseKey = release.slug; 
    const tokenId = `${releaseKey}-${id}`;

    let token;
    const tokens = await strapi.entityService.findMany("api::token.token", {
      filters: {
        tokenId,
      },
    });

    if (!tokens || tokens.length === 0) {
      //Does token exist in db, if not create it

      let metadata = await getOriginalTokenMetadata(
        typeKey,
        releaseKey.replace("dc", ""),//ToDo: update the container folder name to include dc;
        id
      );

      //Tweak metadata for more robust support
      //https://docs.opensea.io/docs/metadata-standards

      const releaseMediaUri = `${mediaBaseUri}/${typeKey}/${releaseKey.replace("dc", "")}`;

      //metadata.animation_url = "WebGL url";
      //metadata.external_url = `https://dimm.city/${typeKey}/${releaseKey}/${metadata.edition}`;

      metadata.image = `${releaseMediaUri}/${metadata.edition}.png`;
      metadata.thumbnail_uri = `${releaseMediaUri}/thumbnail_${metadata.edition}.png`;
      metadata.compiler = "Daemon";

      token = await strapi.entityService.create("api::token.token", {
        data: {
          tokenId: tokenId,
          metadata: metadata,
          release: release.id,
          publishedAt: new Date()
        },
      });

    } else {
      token = tokens[0];
    }

    return token;
  },
});
