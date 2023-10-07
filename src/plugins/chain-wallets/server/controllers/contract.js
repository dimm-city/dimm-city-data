const { TYPE_CONTRACT } = require("../consts");

// async function uploadTokenAssets(ctx) {
//   try {
//     const zipFile = ctx.request.files.zipFile;
//     const { contract } = ctx.params;
//     const service = strapi.service(TYPE_CONTRACT);

//     const result = await service.uploadTokenAssets(contract, zipFile);

//     ctx.body = result;
//   } catch (error) {
//     ctx.body = error;
//     ctx.response.status = 500;
//     strapi.log.error(error);
//   }
// }


async function importTokens(ctx, next) {
  try {
    
    const { contract } = ctx.params;
    const service = strapi.service(TYPE_CONTRACT);
    var result = await service.importTokens(contract);
  
    ctx.body = result;
  } catch (err) {
    ctx.body = err;
    ctx.response.status = 500;
    console.log(err);
  }
}

// module.exports = {
//   importTokens,
//   updateTokens,
// };

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(TYPE_CONTRACT, ({ strapi }) => ({
  //uploadTokenAssets,
  importTokens,
}));
