module.exports = ({ env }) => ({
  "chain-wallets": {
    enabled: true,
    resolve: "../strapi-plugin-chain-wallets",
    config: {
      assetPath: ".tokens",
      enableCron: false
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  "dimm-city": {
    enabled: true,
    resolve: "./src/plugins/dimm-city",
  },
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
    },
  },
});
//https://github.com/jakeFeldman/strapi-provider-upload-azure-storage

// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
