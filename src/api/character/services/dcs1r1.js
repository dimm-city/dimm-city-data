const { createCoreService } = require("@strapi/strapi").factories;
const mediaTypes = {
  images: "images",
  thumbnails: "thumbnails",
  mp4: "mp4",
};
const CharacterStates = {
  Annihilated: -128,
  Unminted: -1,
  Unopened: 1,
  Alive: 10,
  Ethereal: 20,
  Lost: 127,
};

function formatMediaUrl(mediaType, releaseKey, id) {
  let baseUri = strapi.config.server.url;
  return `${baseUri}/api/chain-wallets/${mediaTypes[mediaType]}/${releaseKey}/${id}.png`;
}

async function getMergedMetadata(token, character) {
  let output = token.metadata ?? { attributes: [] };

  output.image = formatMediaUrl(
    mediaTypes.images,
    token.contract.slug,
    token.tokenId
  );

  output.fullresolution_uri = output.image;

  output.thumbnail_uri = formatMediaUrl(
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

  if (character && character.publishedAt) {
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
    ? CharacterStates.Alive
    : CharacterStates.Unminted;
  output.compiler = "Daemon";
  return output;
}

// //Kept only as an example of handling state for now
// async function getCharacterMetadata(token, character) {
//   //   const releaseKey = token.contract.slug;
//   //   const id = token.tokenId;
//   let state = CharacterStates.Alive; //.Unminted;

//   //   const contractService = strapi.service("api::sporos.contracts");
//   //   const isValid = await contractService.isValidToken(releaseKey, id);

//   //   if (isValid) {
//   //     state = await contractService.getTokenState(release.slug, id);
//   //   }

//   let output = {};

//   switch (state) {
//     case CharacterStates.Alive:
//       output = await getMergedMetadata(token, character);

//       break;
//     case CharacterStates.Annihilated:
//       Object.assign(output, {
//         description: "This Sporo can no longer be contacted.",
//         image: formatMediaUrl(mediaTypes.images, release.slug, "destroyed"),
//         attributes: [],
//       });
//       break;
//     case CharacterStates.Ethereal:
//       output = require("./metadata/etheral.json");
//       break;
//     case CharacterStates.Lost:
//       Object.assign(output, {
//         description: "Has been lost in the ether...",
//         image: formatMediaUrl(mediaTypes.images, release.slug, "lost"),
//         attributes: [],
//       });
//       break;
//     case CharacterStates.Unminted:
//       output = require("./metadata/pack.json");
//       output.attributes = [
//         {
//           trait_type: "Status",
//           value: "Unminted",
//         },
//       ];
//       break;
//     case CharacterStates.Unopened:
//       output = require("./metadata/pack.json");
//       break;
//     default:
//       break;
//   }

//   // output.attributes = output.attributes
//   //   ? output.attributes.filter((a) => a.trait_type != "Outline")
//   //   : [];

//   output.state = state;
//   output.compiler = "Daemon";

//   delete output.fullresolution_uri;
//   return output;
// }

module.exports = {
  async initializeEntity(token) {
        const race = await strapi.entityService.findMany("api::race.race", {
            filters: {
                name: "Rabbits",
            },
        });
    let output = {
      name: token?.metadata?.name,
      backstory: token?.metadata?.description,
      playerCharacter: true,
      ap: 10,
      hp: 10,
      race: race,
      skin: token.metadata.attributes.find(a => a.trait_type == "Body").value,
      eyes: token.metadata.attributes.find(a => a.trait_type == "Eyes").value,
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
