const ethers = require("ethers");
const path = require("path");
const fs = require("fs");
const { createCoreService } = require("@strapi/strapi").factories;
const ERC721Mintable = require("../abi/ERC721Mintable.json");
const {
  TYPE_WALLET,
  TYPE_TOKEN,
  TYPE_CONTRACT,
  NAME_MINT_FUNCTION,
} = require("../consts");

let isSyncing = false;

async function createContractInstance(contract, wallet = null) {
  //ToDo switch to JsonRpcProvider (AVAX) https://docs.infura.io/infura/networks/avalanche-c-chain/how-to/choose-a-network

  let smartContract;
  const provider = new ethers.providers.InfuraProvider(
    contract.chain ?? "homestead",
    strapi.plugin("chain-wallets").config("infuraProjectId")
  );
  if (wallet) {
    const etherWallet = new ethers.Wallet(wallet.key, provider);

    smartContract = new ethers.Contract(
      contract.address,
      contract.abi ?? ERC721Mintable,
      etherWallet
    );
  } else {
    smartContract = new ethers.Contract(
      contract.address,
      contract.abi ?? ERC721Mintable,
      provider
    );
  }
  return smartContract;
}

async function mintToken(slug, toAddress) {
  const contractSvc = strapi.service("plugin::chain-wallets.chain-contract");

  const { results } = await contractSvc.find({
    filters: { slug: slug },
    populate: { admin: true },
  });
  const contract = results.at(0);

  let receipt;
  const customSvc = strapi.services[contract.contractService];
  //ToDo: allow this function to be overridden per contract, must return ether Transaction
  if (
    contract.contractService &&
    customSvc &&
    customSvc[NAME_MINT_FUNCTION] instanceof Function
  ) {
    receipt = await customSvc[NAME_MINT_FUNCTION](contract, toAddress);
  } else {
    const smartContract = await createContractInstance(
      contract,
      contract.admin
    );

    receipt = await defaultMintStrategy(smartContract, toAddress);
  }

  //TODO: Allow to run in background or move out of function
  await contractSvc.syncContract(contract);

  // Extract the token ID from the event data in the transaction receipt
  const tokenId = receipt.events[0]?.args?.tokenId?.toString();

  return tokenId;
}

async function defaultMintStrategy(smartContract, toAddress) {
  const tx = await smartContract.safeMint(toAddress, "");

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();

  return receipt;
}

async function updateContractDetails(id, smartContract, currentBlock) {
  let totalSupply = 0;
  try {
    totalSupply = await smartContract.totalSupply();
  } catch {
    strapi.log.warn(`Could not get total supply for contract: ${id}`);

    /*TODO: 
     get count of tokens published for that contract
     get price
     get maxSupply
     get Paused
     get owner
     get MetadataBaseUri
    */
  }
  await strapi.service(TYPE_CONTRACT).update(id, {
    data: {
      totalSupply: totalSupply,
      lastSynced: currentBlock,
    },
  });
}

async function uploadTokenMedia(mediaPath, folder = null) {
  try {
    // Ensure the image file exists
    if (!fs.existsSync(mediaPath)) {
      console.error(`File not found: ${mediaPath}`);
      return;
    }

    let type = "doc";
    if (path.extname(mediaPath) === ".jpg") {
      type = "image/jpeg";
    } else if (path.extname(mediaPath) === ".png") {
      type = "image/png";
    } else if (path.extname(mediaPath) === ".mp4") {
      type = "video/mp4";
    } else if (path.extname(mediaPath) === ".mp3") {
      type = "audio/mp3";
    }
    const fileName = path.basename(mediaPath);

    const stats = fs.statSync(mediaPath);

    const uploadResult = await strapi.plugins.upload.services.upload.upload({
      data: {
        fileInfo: { folder: folder },
        captoin: "Token",
      },
      files: {
        path: mediaPath,
        name: fileName,
        type: type, // mime.lookup(filePath),
        size: stats.size,
      },
    });

    console.log(`New media created with ID: ${JSON.stringify(uploadResult)}`);
    return uploadResult;
  } catch (error) {
    console.error(`An error occurred while uploading media: ${error.message}`);
  }
}

async function importTokens(contractSlug) {
  const tokenSvc = strapi.service(TYPE_TOKEN);
  const contracts = await this.find({
    filters: {
      slug: contractSlug,
    },
  });

  const contract = contracts?.results?.at(0);
  const assetPathBase =
    strapi.plugin("chain-wallets").config("assetPath") ?? ".tokens";

  const directoryPath = path.join(assetPathBase, `${contract.slug}/json`);
  const mediaDirectoryPath = path.join(
    assetPathBase,
    `${contract.slug}/images`
  );

  try {
    const files = fs.readdirSync(directoryPath);

    // Filter files that have a numeric filename and end with '.json'
    const jsonFiles = files.filter((file) => {
      return !isNaN(parseInt(file)) && path.extname(file) === ".json";
    });

    const folderService = strapi.service("plugin::upload.folder");
    const folders = await folderService.getStructure();
    // Ensure the 'tokens' folder exists
    let tokensFolder = folders.find((f) => f.name === "tokens");
    if (tokensFolder == null) {
      tokensFolder = await folderService.create({ name: "tokens" });
    }

    // Ensure the contract folder exists
    let uploadFolder = folders.find((f) => f.name === contractSlug);
    if (uploadFolder == null) {
      uploadFolder = await folderService.create({
        name: contractSlug,
        parent: tokensFolder.id,
      });
    }

    // Read each JSON file and process its contents
    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);
      const data = fs.readFileSync(filePath);
      const jsonData = JSON.parse(data);
      const tokenId = path.basename(file, path.extname(file));

      const tokens = await tokenSvc.find({
        filters: {
          slug: `${contract.slug}-${tokenId}`,
        },
        publicationState: "preview",
      });

      if (tokens?.results?.length === 0) {
        try {
          const imageFilePath = path.join(mediaDirectoryPath, `${tokenId}.png`);
          const imageInfo = await uploadTokenMedia(
            imageFilePath,
            uploadFolder.id
          );

          const videoFilePath = path.join(mediaDirectoryPath, `${tokenId}.mp4`);
          let videoInfo = null;
          if (fs.existsSync(videoFilePath)) {
            videoInfo = await uploadTokenVideo(videoFilePath, uploadFolder.id);
          }
          await tokenSvc.create({
            data: {
              contract: contract,
              tokenId: tokenId,
              slug: `${contract.slug}-${tokenId}`,
              mainImage: imageInfo?.at(0)?.id,
              mainVideo: videoInfo?.at(0)?.id,
              metadata: jsonData,
              publishedAt: null,
            },
          });
        } catch (error) {
          strapi.log.error("Duplicate token", tokens, error);
        }
      } else {
        await tokenSvc.update(tokens.results.at(0).id, {
          data: {
            metadata: jsonData,
          },
        });
      }
    }
  } catch (err) {
    console.log("Unable to read directory: " + err);
  }
}

// async function uploadTokenAssets(contractId, zipFile) {
//   const contracts = await this.find({
//     filters: {
//       slug: contractId,
//     },
//   });

//   const contract = contracts?.results?.at(0);
//   const tempFolderName = "temp-" + Date.now();

//   const rootDir = path.resolve(".");
//   const tempFolderPath = path.join(rootDir, tempFolderName);
//   fs.mkdirSync(tempFolderPath, {
//     recursive: true,
//   });

//   const unzippedFiles = await unzipper.Open.file(zipFile.path);
//   const assetPathBase =
//     strapi.plugin("chain-wallets").config("assetPath") ?? ".tokens";

//   // Parse and process each file in the zip archive
//   for (const file of unzippedFiles.files) {
//     if (file.type === "File" && path.extname(file.path) === ".json") {
//       // Save the json file to the server
//       const jsonPath = path.join(
//         assetPathBase,
//         `${contract.slug}/json/${file.path}`
//       );

//       fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
//       fs.renameSync(file.path, jsonPath);
//       //fs.writeFileSync(jsonPath, await file.buffer());
//     }

//     if (
//       file.type === "File" &&
//       path.extname(file.path).match(/\.(jpeg|jpg|png|mp4)$/)
//     ) {
//       // Save the image file to the server
//       const imagePath = path.join(
//         assetPathBase,
//         `${contract.slug}/images/${file.path}`
//       );
//       fs.mkdirSync(path.dirname(imagePath), { recursive: true });
//       fs.writeFileSync(imagePath, await file.buffer());
//     }
//   }

//   // Remove the temporary files
//   fs.rmSync(tempFolderPath, { recursive: true });
// }

function getEntityService(contract) {
  if (contract?.entityType) {
    return strapi.services[contract.entityType];
  }
  return null;
}
async function getTokenEntity(contract, tokenId) {
  const entitySvc = getEntityService(contract);
  if (entitySvc) {
    const x = await entitySvc.find({
      filters: {
        tokenId: `${contract.slug}-${tokenId}`,
      },
      publicationState: "preview",
    });

    if (x.results?.length > 0) return x.results.at(0);
  }

  return null;
}
async function syncContracts() {
  if (!isSyncing) {
    isSyncing = true;

    const contractSvc = strapi.service(TYPE_CONTRACT);

    //ToDo: refactor to query only contracts that are enabled
    const contractResults = await contractSvc.find({
      filters: {
        enableSync: true,
      },
      publicationState: "live",
    });
    const contracts = contractResults.results;

    let eventCount = 0;
    strapi.log.info(`Found ${contracts.length} contracts to sync`);
    for (const contract of contracts) {
      eventCount += await syncContract(contract);
    }

    isSyncing = false;
    const msg = `${contracts.length} synced, ${eventCount} total events`;
    strapi.log.info(msg);
    return msg;
  } else {
    return "Sync already in progress";
  }
}
async function syncContract(contract) {
  const walletSvc = strapi.service(TYPE_WALLET);
  const tokenSvc = strapi.service(TYPE_TOKEN);

  const smartContract = await createContractInstance(contract);
  const currentBlock = await smartContract.provider.getBlockNumber();
  const entitySvc = getEntityService(contract);
  // Get the current transaction count for the contract
  strapi.log.info(`syncing contract: ${contract.slug}`);
  const events = await smartContract.queryFilter(
    "Transfer",
    contract.lastSynced ?? 0
  );
  strapi.log.info(`found: ${events.length} since ${contract.lastSynced}`);
  // Check for new events
  for (const event of events) {
    strapi.log.info(`found: ${event.event} at ${event.blockHash}`);
    if (event.event == "Transfer" && event.args) {
      // Get the address of the sender and receiver
      const from = event.args.from;
      const to = event.args.to;

      // Get the token ID transferred
      const tokenId = event.args.tokenId.toString();
      let tokens = await tokenSvc.find({
        filters: {
          slug: `${contract.slug}-${tokenId}`,
        },
        populate: "*",
        publicationState: "preview",
      });
      let token = tokens.results.at(0);
      if (!token) {
        token = await tokenSvc.create({
          data: {
            tokenId: `${tokenId}`,
            slug: `${contract.slug}-${tokenId}`,
            contract,
          },
        });
      }

      // Create the sender's wallet if it does not exist
      await walletSvc.getOrCreateWallet(contract.chain, from);

      // Get the receiver's wallet
      let receiverWallet = await walletSvc.getOrCreateWallet(
        contract.chain,
        to
      );

      if (token.wallet?.id != receiverWallet.id) {
        // Update the token ownership in the DB
        await tokenSvc.update(token.id, {
          data: {
            wallet: receiverWallet,
            publishedAt: token.publishedAt ?? new Date().toISOString(),
          },
        });

        if (entitySvc && contract.autoPublishEntity === true) {
          const entity = await getTokenEntity(contract, tokenId);
          if (entity) {
            await entitySvc.update(entity.id, {
              data: {
                token: token,
                publishedAt: token.publishedAt ?? new Date().toISOString(),
              },
            });
          }
        }
      }
    }
  }
  await updateContractDetails(contract.id, smartContract, currentBlock);
  return events.length;
}

module.exports = createCoreService(TYPE_CONTRACT, ({ strapi }) => ({
  getSmartContract: createContractInstance,
  mintToken,
  //uploadTokenAssets,
  importTokens,
  syncContracts,
  syncContract,
}));
