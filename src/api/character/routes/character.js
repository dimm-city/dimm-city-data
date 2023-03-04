"use strict";

/**
 * character router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::character.character", {
    only: ['find', 'findOne', 'update', 'create'],
    config:{
        update:{
            policies:["api::character.owns-token"]
        }
    }
});
// module.exports = {
//     routes: [
//       {
//         method: "PUT",
//         path: "/characters/:id",
//         handler: "character.update",
//         config: {
//           policies: ["api::character.owns-token"],
//         },
//       },
//     ]
// };
