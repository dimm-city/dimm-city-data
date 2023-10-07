## Roadmap

### In progress

* Policy:OwnsToken - Check that the token associated with the current request is owned by the logged in user
* ContractService:mintToken - Mint a token from a managed wallet
* WalletService:assignUserWallet - Assign a wallet to a user
### Pending

* WalletService:importWallet - Import a wallet to allow plugin to manage the wallet on the users behalf
* ContractService:updateAttributes - Update contract attributes from blockchain contract
* ContractService:getExtensions - Returns an object of all extension functions. ie. metadataExtender, entityInitializer, imageLoader
* Set default permissions: https://github.com/strapi/strapi/blob/921d30961d6ba96cc098f2aea197350a49f990bd/packages/plugins/users-permissions/server/services/users-permissions.js
* Auto import tokens