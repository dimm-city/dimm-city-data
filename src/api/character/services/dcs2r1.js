const { createCoreService } = require("@strapi/strapi").factories;
const mediaTypes = {
  images: "images",
  thumbnails: "thumbnails",
  mp4: "mp4",
};

function formatMediaUrl(mediaType, releaseKey, id) {
  let baseUri = strapi.config.server.url;
  return `${baseUri}/api/chain-wallets/${mediaTypes[mediaType]}/${releaseKey}/${id}.png`;
}

async function getMergedMetadata(token, character) {
  let output = token.metadata ?? { attributes: [] };

  output.external_url = `https://dimm.city/citizens/${token.contract.slug}-${token.tokenId}`;
  output.image = formatMediaUrl(
    mediaTypes.images,
    token.contract.slug,
    token.tokenId
  );

  output.thumbnail_url = formatMediaUrl(
    mediaTypes.thumbnails,
    token.contract.slug,
    token.tokenId
  );

  if (output.animation_url) {
    output.animation_url = formatMediaUrl(
      mediaTypes.mp4,
      token.contract.slug,
      token.tokenId
    );
  }


  if (character && character.publishedAt && character.playerUpdated) {
    output.name = character.name;
    output.dreams = character.dreams;
    output.description = character.vibe;
    output.hasCharacter = true;
    output.flaws = character.flaws;
    output.beliefs = character.beliefs;
    output.backstory = character.backstory;
    //TODO: complete character attributes
    //Tweak metadata for more robust support
    //https://docs.opensea.io/docs/metadata-standards
    output.attributes.push({
      value: true,
      trait_type: "Has Citizen File",
    });
    output.attributes.push({
      value: character.height,
      trait_type: "Height (cm)",
      display_type: "number",
    });
    output.attributes.push({
      value: character.weight,
      trait_type: "Weight (kg)",
      display_type: "number",
    });
    output.attributes.push({
      value: character.hp,
      trait_type: "HP",
      display_type: "number",
    });
    output.attributes.push({
      value: character.ap,
      trait_type: "AP",
      display_type: "number",
    });
  } else {
    output.attributes.push({
      value: false,
      trait_type: "Has Citizen File",
    });
    output.hasCharacter = false;
  }

  output.state = token.publishedAt
    ? "Alive"
    : "Unminted";
  output.compiler = "Daemon";
  return output;
}

module.exports = {
  async initializeEntity(token) {
    const race = await strapi.entityService.findMany("api::race.race", {
      filters: {
        name: "Cat",
      },
    });
    let output = {
      name: token?.metadata?.name ?? `Cat #${token.metadata?.edition}`,
      //backstory: token?.metadata?.description,
      playerCharacter: true,
      ap: 10,
      hp: 10,
      race: race,
      skin: token.metadata.attributes.find((a) => a.trait_type == "Body").value,
      eyes: token.metadata.attributes.find((a) => a.trait_type == "Eyes").value,
    };

    return output;
  },
  async extendTokenMetadata(token, character) {
    if (!character) {
      let characters = await strapi
        .entityService("api::character.character")
        .find({
          filters: {
            token: {
              id: token.id,
            },
          },
        });

      if (characters?.results.length > 0) {
        character = characters.results.at(0);
      }
    }
    token = getMergedMetadata(token, character);
    return token;
  },
};
