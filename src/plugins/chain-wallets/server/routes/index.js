module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/test/:id",
        handler: "chain-token.findOne",
        config: {
          policies: ["owns-token"],
        },
      },
      {
        method: "GET",
        path: "/tokens",
        handler: "chain-token.find",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/tokens/:id",
        handler: "chain-token.findOne",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/tokens/:id/owns",
        handler: "chain-token.ownsToken",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/contracts",
        handler: "chain-contract.find",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/contracts/:id",
        handler: "chain-contract.findOne",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/wallets/attach/:network",
        handler: "chain-wallet.attachUserWallet",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/wallets/detach/:network/:address",
        handler: "chain-wallet.detachUserWallet",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/wallets",
        handler: "chain-wallet.getUserWallets",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/auth/verification-message",
        handler: "authentication.getVerificationMessage",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/auth/login",
        handler: "authentication.login",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/import-tokens/:contract",
        handler: "chain-contract.importTokens",
        config: {
          policies: [],
        },
      },
      // {
      //   method: "POST",
      //   path: "/upload-tokens/:contract",
      //   handler: "chain-contract.uploadTokenAssets",
      //   config: {
      //     policies: [],
      //   },
      // },
      {
        method: "GET",
        path: "/metadata/:contract/:tokenId",
        handler: "chain-token.getTokenMetadata",
        config: {
          policies: ["token-exists"],
        },
      },
      {
        method: "GET",
        path: "/images/:contract/:tokenId.png",
        handler: "chain-token.getTokenImage",
        config: {
          policies: ["token-exists"],
        },
        
      },
      {
        method: "GET",
        path: "/thumbnails/:contract/:tokenId.png",
        handler: "chain-token.getTokenImage",
        config: {
          policies: ["token-exists"],
        },
        
      },
    ],
  },
};
