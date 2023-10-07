"use strict";

const { TYPE_TOKEN } = require("../consts");

async function getTokenImage(ctx) {
  const { tokenId, contract } = ctx.params;

  try {
    // Return the image file
    const service = strapi.service(TYPE_TOKEN);
    const image = await service.getImage(contract, tokenId);

    if (image === null) return ctx.badRequest(null, "Image not found");

    ctx.set("Content-Type", "image/png");
    ctx.body = image;
  } catch (error) {
    console.error("Error getting image", error);
  }
}
async function getTokenMetadata(ctx, next) {
  const { tokenId, contract } = ctx.params;
  const service = strapi.service(TYPE_TOKEN);
  let result = await service.getMetadata(contract, tokenId);
  if (result) {
    ctx.body = result;
  } else {
    ctx.response.statusCode = 404;
  }
}
async function ownsToken(ctx, next) {
  if (ctx.state.user?.id == null) return false;

  const service = strapi.service(TYPE_TOKEN);
  const token = await service.findOne(ctx.params.id, {
    populate: { user: true },
  });
  let result = token.user?.id === ctx.state.user?.id;

  ctx.body = result;
}

// module.exports = {
//   getTokenMetadata,
//   getTokenImage
// };

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(TYPE_TOKEN, ({ strapi }) => ({
  getTokenMetadata,
  getTokenImage,
  ownsToken
}));
