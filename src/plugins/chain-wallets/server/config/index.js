"use strict";

module.exports = {
  default: ({ env }) => ({
    assetPath: env("CW_ASSET_PATH") ?? ".tokens",
    verificationMessage: "sign in",
    infuraProjectId: env("infura_project_id") ?? "INFURA PROJECT ID",
    enableCron: false
  }),
  validator() {},
};
