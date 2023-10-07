# Chain Wallets Strapi Plugin

A Strapi v4 plugin that allows EVM smart contracts to be easily associated with content-types.

Here are some of the things Chain Wallets currently does:

- [Associate content-types to a smart contracts](docs/contracts-content.md)
- [Associate a tokens with entities](docs/contracts-content.md)
- [Automatically sync tokens to Strapi content types](docs/syncing-tokens.md)
- [Automatically sync token ownership in database](docs/syncing-tokens.md)
- [Create a "managed wallet" for and associate it with the current user](docs/wallets.md)
- [Provides an API endpoint to return token metadata](docs/metadata-api.md)
  - [Protects metadata of unminted tokens](docs/metadata-api.md)
  - [Protects images of unminted tokens](docs/metadata-api.md)
- [Protect your routes with 'token-exists' and 'owns-token' policies](docs/policies.md)
- [Extend entity service with to integrate with token metadata](docs/hooks.md#service-functions)
  - [Allow an initializer function to be specified for each contract](docs/hooks.md#initializeEntity)
  - [Extend token metadata from entity](docs/hooks.md#extendtokenmetadata)
- [Configure hooks for your content-type for:](docs/hooks.md#model-lifecycle)
  - [Creating new entity from token metadata](docs/hooks.md#beforecreate)
- [Import metadata for all tokens in a contract](docs/services.md#contract-service-api)
- [Easily get an initialized EthersJS contract instance from the `chain-contract` service](docs/services.md#contract-service-api)
- [...and more to come!](docs/TODO.md)

### Roadmap

- Provide "Owns Token" policy to only allow token owners to call the controller action
- Allow users to associate existing wallets with their login
- Sync common 721 properties to contract entity
- Mint a token from a managed wallet
- Provide imageLoader hook to allow different image locations per contract
