"use strict";

const { ethers, BigNumber } = require("ethers");

const ContractJson = require("../lib/contracts/DimmCityV1Base.json");

const { config } = require("../lib/config");
const { CharacterStates } = require("../lib/constants");

const contracts = {};
/**
 * contracts service.
 */

function getSporosContractInstance(releaseKey) {
  if (contracts[releaseKey]) return contracts[releaseKey];

  const provider = new ethers.providers.InfuraProvider(
    "homestead",
    process.env.provider_project_id
  );
  console.log(releaseKey);
  const release = config.releases[releaseKey];
  const address = release.address;
  const contract = new ethers.Contract(address, ContractJson.abi, provider);
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
      const contract = getSporosContractInstance(releaseKey);
      const owner = await contract.ownerOf(tokenId);
      console.log("canEdit", owner, signer);
      return owner === signer;
    } catch (error) {
      console.error("canEditToken failed:", error);
      return false;
    }
  },
  async getTokenState(releaseKey, tokenId) {
    const contract = getSporosContractInstance(releaseKey);
    const isValid = await this.isValidToken(releaseKey, tokenId);
    if (isValid) {
      const state = await contract.getState(tokenId);
      return state;
    } else return CharacterStates.Unminted;
  },
  async getTotalSupply(releaseKey) {
    const contract = getSporosContractInstance(releaseKey);
    const numberOfTokens = await contract.totalSupply();
    return Number(numberOfTokens);
  },
  async isValidToken(releaseKey, tokenId) {
    const contract = getSporosContractInstance(releaseKey);
    const supply = await contract.totalSupply();
    console.log(tokenId, supply.toNumber());
    if (!isNaN(tokenId) && Number(tokenId) <= supply.toNumber()) {
      return true;
    }
    return false;
  },
});
