"use strict";

const { ethers, BigNumber } = require("ethers");

const ContractJson = require("../lib/contracts/DimmCityV1Base.json");

const { config } = require("../lib/config");
const { CharacterStates } = require("../lib/constants");


const contracts = {};
let releases = [];

/**
 * contracts service.
 */

async function loadReleases() {
  releases = await strapi.entityService.findMany(
    "api::character-release.character-release",
    {
      filters: {
        publishedAt: {
          $notNull: true,
        },
      },
      populate: ["blockchain"],
    }
  );
  console.log(releases);
}

async function getSporosContractInstance(releaseKey) {
  if (contracts[releaseKey]) return contracts[releaseKey];

  if (releases?.length == 0) {
    await loadReleases();
  }

  console.log(releaseKey);
  const release = releases.find((r) => r.slug == releaseKey);

  const provider = new ethers.providers.InfuraProvider(
    release.blockchain.name ?? "homestead",
    process.env.provider_project_id
  );
  const address = release.contractAddress;
  const contract = new ethers.Contract(address, release.abi, provider);
  contracts[releaseKey] = contract;
  return contract;
}

function hasContract(releaseKey) {
  return config.releases[releaseKey] != null;
}

module.exports = () => ({
  async canEditToken(signer, releaseKey, tokenId) {
    if (!hasContract(releaseKey)) return false;
    try {
      const contract = await getSporosContractInstance(releaseKey);
      const owner = await contract.ownerOf(tokenId);
      console.log("canEdit", owner, signer);
      return owner === signer;
    } catch (error) {
      console.error("canEditToken failed:", error);
      return false;
    }
  },
  async getTokenState(releaseKey, tokenId) {
    const contract = await getSporosContractInstance(releaseKey);
    const isValid = await this.isValidToken(releaseKey, tokenId);
    if (isValid) {
      const state = await contract.getState(tokenId);
      return state;
    } else return CharacterStates.Unminted;
  },
  async getTotalSupply(releaseKey) {
    const contract = await getSporosContractInstance(releaseKey);
    const numberOfTokens = await contract.totalSupply();
    return Number(numberOfTokens);
  },
  async isValidToken(releaseKey, tokenId) {
    const contract = await getSporosContractInstance(releaseKey);
    const supply = await contract.totalSupply();
    console.log(tokenId, supply.toNumber());
    if (!isNaN(tokenId) && Number(tokenId) <= supply.toNumber()) {
      return true;
    }
    return false;
  },
  async getTokensForWallet(address) {
    let output = [];
    await loadReleases();
    for (const r of releases) {

      const key = r.slug;
      const contract = await getSporosContractInstance(key); // contracts[key];

      const balance = await contract.balanceOf(address);
      const number = balance.toNumber();
      const tokenIds = [];
      for (let index = 0; index < number; index++) {
        const sporo = await contract.tokenOfOwnerByIndex(address, index);
        const tokenId = sporo.toNumber();
        tokenIds.push(`${r.slug}-${tokenId}`);
      }

      const data = await strapi.entityService.findMany("api::token.token", {
        filters: {
          tokenId: {
            "$in": tokenIds
          }
        },
        populate: ["character"],
      });
      output = [...output, ...data];
    }
    return output;
  },
});
