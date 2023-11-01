const { strict: assert } = require("assert");
const jwt = require("jsonwebtoken");

const getAdditionalGrantConfigs = (baseURL) => ({
  itchio: {
    enabled: true,
    icon: "itchio",
    key: "",
    secret: "",
    oauth: 2,
    custom_params: {
      response_type: "token",
      redirect_uri: "http://localhost:5173/connect/redirect/itchio",
    },
    authorize_url: "https://itch.io/user/oauth",
    redirect_uri: "http://localhost:5173/connect/redirect/itchio",
    callback: `http://localhost:5173/connect/redirect/itchio`,
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
