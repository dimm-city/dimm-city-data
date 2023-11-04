const jwt = require("jsonwebtoken");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "plugin::users-permissions.profile",
  ({ strapi }) => ({
    async associateLogin(ctx) {
      const { secondary_token } = ctx.request.body;

      try {
        const decoded = await jwt.verify(
          secondary_token,
          strapi.config.get("plugin.users-permissions.jwtSecret")
        );

        const profileService = strapi
          .plugin("users-permissions")
          .service("profile");

        //Get the secondary user for the token
        // const secondaryUser = await strapi
        //   .query("user", "users-permissions")
        //   .findOne({ id: decoded.id });

        const secondaryUser = await strapi.plugins[
          "users-permissions"
        ].services.user.fetch(decoded.id, {
          populate: "*",
        });

        // //Get the profile for the secondary user
        // const secondaryUserProfile = await profileService.findOne({
        //   users: secondaryUser.id,
        // });

        const secondaryUserProfile = await strapi.db
          .query("plugin::users-permissions.profile")
          .findOne({
            where: { users: secondaryUser.id },
            populate: { category: true },
          });
        //Get the profile for the logged in user
        // const primaryUserProfile = await profileService.findOne({
        //   user: ctx.state.user.id,
        // });
        //const primaryUserProfile = ctx.state.user.profile;
        const primaryUserProfile = await strapi.db
          .query("plugin::users-permissions.profile")
          .findOne({
            where: { users: ctx.state.user.id },
            populate: { category: true },
          });
        // Update empty fields on the primary user's profile with values from the secondary user's profile
        for (let key in primaryUserProfile) {
          if (!primaryUserProfile[key]) {
            primaryUserProfile[key] = secondaryUser.profile[key];
          }
        }

        // Add the secondary user to the primary user's profile
        primaryUserProfile.secondaryUsers.push(secondaryUser);

        // Save the primary user's profile with the secondary user added
        await strapi
          .query("profile")
          .update({ id: primaryUserProfile.id }, primaryUserProfile);

        // Delete the profile that was created for the secondary user
        await strapi.query("profile").delete({ id: secondaryUserProfile.id });

        // Return the primary user's profile and a message saying that the secondary user was added to the primary user
        ctx.send({
          message: "Secondary user added to primary user",
          profile: primaryUserProfile,
        });
      } catch (err) {
        ctx.send({ message: "Invalid token", error: err });
      }
    },
  })
);
