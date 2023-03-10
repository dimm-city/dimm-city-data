let chainWalletConfig = {
  enabled: true,
  resolve: './node_modules/strapi-plugin-chain-wallets',
  config: {
    imagePath: "/home/site/images"
  },
};

if (process.env.NODE_ENV == "development") {
  chainWalletConfig.resolve = "../strapi-plugin-chain-wallets";
  chainWalletConfig.config.imagePath = ".tokens";
}

module.exports = ({ env }) => ({
  "chain-wallets": chainWalletConfig,
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  upload: {
    config: {
      provider: "strapi-provider-upload-azure-storage",
      providerOptions: {
        account: env("storage_account"),
        accountKey: env("storage_account_key"),
        serviceBaseURL: env("storage_url"),
        containerName: env("storage_container_name"),
        cdnBaseURL: env("storage_cdn_url"),

        defaultPath: "assets",
        maxConcurrent: 10,
      },
    },
  },
});
//https://github.com/jakeFeldman/strapi-provider-upload-azure-storage

// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
// https://dimmcitystorage.blob.core.windows.net/uploads/assets/thumbnail_FBWW_4_C9_XEAQ_Ol_VJ_c615f98a6b.jpg
