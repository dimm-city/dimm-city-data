# Chain Wallets Strapi Plugin

Chain Wallets is a plugin for Strapi v4 that allows EVM smart contracts to be integrated into your Strapi application easily.


## Roadmap

* Policy:OwnsToken - Check that the token associated with the current request is owned by the logged in user
* Hook:ExtendMetadata - Allow a contract to specify a function to run to merge token metadata for that contract
* Hook:OnTokenCreated - Allow a contract to specify a function to run when a token is created
* Feature:ImportTokens - Upload the metadata for all tokens for a given contract
* WalletService:createUserWallet - Service method to create a managed wallet and assign it to a user
* WalletService:assignUserWallet - Assign a wallet to a user
* ContractService:updateAttributes - Update contract attributes from blockchain contract
* ContractService:mintToken - Mint a token from a managed wallet
* ContractService:getContractInstance - Return an EthersJS contract instance for a given contract id


