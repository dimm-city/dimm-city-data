const { strict: assert } = require("assert");
const jwt = require("jsonwebtoken");

const frontEndUrl = strapi.config.get("server.frontEndUrl", "");

const getAdditionalGrantConfigs = (baseURL) => ({
  itchio: {
    enabled: true,
    icon: "itchio",
    key: "",
    secret: "",
    oauth: 2,
    custom_params: {
      response_type: "token",
      redirect_uri: frontEndUrl + "/connect/redirect/itchio",
    },
    authorize_url: "https://itch.io/user/oauth",
    scope: ["profile:me"],
  },
});

const getAdditionalProviders = ({ purest }) => ({
  async itchio({ accessToken }) {

    const response = await fetch("https://itch.io/api/1/key/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        username: data.user.username,
        email: data.user.username + "@itch.io",
        displayName: data.user.display_name,
      };
    } else{
      return {};
    }
  },
});

module.exports = {
  getAdditionalGrantConfigs,
  getAdditionalProviders,
};
