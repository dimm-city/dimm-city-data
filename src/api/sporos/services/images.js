"use strict";

/**
 * sporos images service.
 */
const { streamToBuffer } = require("../lib/streams.js");
const { BlobServiceClient } = require("@azure/storage-blob");
const NodeCache = require("node-cache");
const currentCache = new NodeCache();
const { BigNumber } = require("ethers");

const connStr = process.env.storage_connection;
const container = process.env.media_storage_container || "media";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

module.exports = () => ({
  async getCustomImage(releaseKey, id) {
    //ToDo: use this to do on-demand render for customized images: https://sharp.pixelplumbing.com/install
  },
  async getImage(releaseKey, id) {
    const ext = "png";
    const contractService = strapi.service("api::sporos.contracts");
    const supply = await contractService.getTotalSupply(releaseKey);
    if (!isNaN(id) && BigNumber.from(id) > BigNumber.from(supply)) {
      throw new Error("404", {
        statusCode: 404,
      });
    }
    console.log("Get image");
    const fileKey = `${releaseKey}/${id}.${ext}`; //_thumbnails
    let output = currentCache.get(fileKey);

    if (output == null) {
      console.log("download image");
      const containerClient = blobServiceClient.getContainerClient(
        `${container}/sporos`
      );
      const blobClient = containerClient.getBlobClient(`${fileKey}`);
      const downloadBlockBlobResponse = await blobClient.download();
      output = await streamToBuffer(
        downloadBlockBlobResponse.readableStreamBody
      );
      currentCache.set(`${fileKey}`, output);
    }
    return output;
  },
  async getThumbnail(releaseKey, id) {
    const ext = "png";
    const contractService = strapi.service("api::sporos.contracts");
    const supply = await contractService.getTotalSupply(releaseKey);
    if (!isNaN(id) && BigNumber.from(id) > BigNumber.from(supply)) {
      throw new Error("404", {
        statusCode: 404,
      });
    }
    console.log("Get thumbnail");
    const fileKey = `${releaseKey}_thumbnails/${id}.${ext}`; //_thumbnails
    let output = currentCache.get(fileKey);

    if (output == null) {
      console.log("download image");
      const containerClient = blobServiceClient.getContainerClient(
        `${container}/sporos`
      );
      const blobClient = containerClient.getBlobClient(`${fileKey}`);
      const downloadBlockBlobResponse = await blobClient.download();
      output = await streamToBuffer(
        downloadBlockBlobResponse.readableStreamBody
      );
      currentCache.set(`${fileKey}`, output);
    }
    return output;
  },
});
