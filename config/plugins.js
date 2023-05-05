module.exports = ({ env }) => ({
  "chain-wallets": {
    enabled: true,
    resolve: "./node_modules/strapi-plugin-chain-wallets",
    config: {
      assetPath: "/home/site/tokens",
      verificationMessage: "sign into dimm city",
      infuraProjectId: "0b07f1a101f54ca6b9e12334f21df3ba"
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },
});
//https://github.com/jakeFeldman/strapi-provider-upload-azure-storage

// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
