function formatMediaUrl(contractSlug, tokenId, filenameSuffix = "") {
    let baseUri = strapi.config.server.url;
    return `${baseUri}/api/chain-wallets/images/${contractSlug}/${tokenId}${filenameSuffix}.png`;
  }

  module.exports ={
    formatMediaUrl
  }