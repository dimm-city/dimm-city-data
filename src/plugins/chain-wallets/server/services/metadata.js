"use strict";

/**
 * metadata service
 */
const ethers = require("ethers");
const ERC721 = require("../contracts/ERC721.json");
module.exports = ({ strapi }) => ({
  // Function to check for transactions in multiple ERC-721 contracts
  async syncWallets() {
    const networkSvc = strapi.service("plugin::chain-wallets.chain-network");
    const walletSvc = strapi.service("plugin::chain-wallets.chain-wallet");
    const tokenSvc = strapi.service("plugin::chain-wallets.chain-token");
    const contractSvc = strapi.service("plugin::chain-wallets.chain-contract");

    const networks = await networkSvc.find({
      filters: {
        publishedAt: {
          $notNull: true,
        },
      },
      populate: ["contracts"],
    });
    for (const network of networks.results) {
      // Connect to the Ethereum network
      const provider = new ethers.providers.InfuraProvider(
        network.name ?? "homestead",
        process.env.provider_project_id
      );

      for (const contract of network.contracts) {
        // Get the contract object
        const smartContract = new ethers.Contract(
          contract.address,
          ERC721,
          provider
        );

        // Get the current transaction count for the contract
        const events = await smartContract.queryFilter({
          fromBlockOrBlockhash: contract.lastSynced ?? 0,
          toBlock: "latest",
        });

        // Check for new events
        for (const event of events) {
          console.log(event, "****");
          if (event.event == "Transfer" && event.args) {
            // Get the address of the sender and receiver
            const from = event.args.from;
            const to = event.args.to;

            // Get the token ID transferred
            const tokenId = event.args.tokenId.toString();
            let tokens = await tokenSvc.find({
              filters: { tokenId },
            });
            let token = tokens.results.at(0);
            if (!token) {
              token = await tokenSvc.create({
                data: {
                  tokenId,
                  contract,
                },
              });
            }
            console.log(to, from, tokenId, token, "*****");
            // Get the sender's wallet
            let senderWallets = await walletSvc.find({
              filters: { address: from },
            });

            if (senderWallets.results.length < 1) {
              // Create a new wallet for the sender if it doesn't exist
              await walletSvc.create({
                data: { address: from, network, managed: false },
              });
            }

            // Get the receiver's wallet
            let receiverWallets = await walletSvc.find({
              filters: { address: to },
            });

            let receiverWallet;
            if (receiverWallets.results.length < 1) {
              // Create a new wallet for the receiver if it doesn't exist
              receiverWallet = await walletSvc.create({
                data: { address: to, network, managed: false },
              });
            } else receiverWallet = receiverWallets.results.at(0);

            // Update the token ownership in the DB
            await tokenSvc.update(token.id, {
              data: { wallet: receiverWallet },
            });

            contract.lastSynced = event.blockNumber;
          }
        }

        contractSvc.update(contract.id, {
          data: { lastSynced: contract.lastSynced },
        });

        result `${networks.results.length} networks synced`;
      }
    }
  },
});
