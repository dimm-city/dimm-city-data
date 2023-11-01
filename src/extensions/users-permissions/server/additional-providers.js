const { strict: assert } = require("assert");
const jwt = require("jsonwebtoken");


const getAdditionalGrantConfigs = (baseURL) => ({
  itchio: {
    enabled: true,
    icon: "itchio",
    key: "",
    secret: "",
    callback: `${baseURL}/itchio/callback`,
    scope: ["profile:me"],
  },
});


const getAdditionalProviders = ({ purest }) => ({
  async itchio({ accessToken }) {
    const itchio = purest({
      provider: "itchio",
      config: {
        reddit: {
          default: {
            origin: "https://itch.io/",
            path: "user/oauth",
            version: "v1",
            headers: {
              Authorization: "Bearer {auth}",
              "user-agent": "strapi",
            },
          },
        },
      },
    });

    return itchio
      .get("me")
      .auth(accessToken)
      .request()
      .then(({ body }) => ({
        username: body.user.username + "_itchio",
        email: `${body.user.username}@itchio.io`, // dummy email as itchio does not provide user email
      }));
  },
});

module.exports = {
  getAdditionalGrantConfigs,
  getAdditionalProviders,
}
