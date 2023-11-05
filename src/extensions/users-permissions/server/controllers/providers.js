const jwt = require("jsonwebtoken");
/***
 * Adds a controller that returns the active authentication providers
 */
module.exports = {
  find: async (ctx) => {
    try {
      const primaryUserProfile = await strapi
        .service("plugin::users-permissions.providers-registry")
        .find();
      ctx.send(primaryUserProfile);
    } catch (err) {
      ctx.send({ message: "Could not load providers", error: err });
    }
  },
};
