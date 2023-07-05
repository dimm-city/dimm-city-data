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
  'dimm-city': {
    enabled: true,
    resolve: './src/plugins/dimm-city'
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "strapi-provider-upload-azure-storage",
      providerOptions: {
        account: env("STORAGE_ACCOUNT"),
        accountKey: env("STORAGE_ACCOUNT_KEY"),
        serviceBaseURL: env("STORAGE_URL"), // optional
        containerName: env("STORAGE_CONTAINER_NAME"),
        defaultPath: "media",
        cdnBaseURL: env("STORAGE_CDN_URL"), // optional
      },
    },
  },
});
//https://github.com/jakeFeldman/strapi-provider-upload-azure-storage

// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
