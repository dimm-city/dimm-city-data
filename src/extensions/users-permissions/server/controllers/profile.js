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

        const userService = strapi.plugin("users-permissions").service("user");

        const profileService = strapi
          .plugin("users-permissions")
          .service("profile");

        //Get the secondary user for the token
        const secondaryUser = await userService.fetch(decoded.id, {
          populate: "*",
        });

        //Get the profile for the logged in user
        const primaryUserProfile = await strapi.db
          .query("plugin::users-permissions.profile")
          .findOne({
            where: { users: ctx.state.user.id },
            populate: { users: true },
          });

        if (primaryUserProfile.id === secondaryUser.profile?.id) {
          return ctx.send({
            message:
              "Profile already associated with this user: " + secondaryUser.id,
            profile: primaryUserProfile,
          });
        }

        // Update empty fields on the primary user's profile with values from the secondary user's profile
        for (let key in primaryUserProfile) {
          if (!primaryUserProfile[key]) {
            primaryUserProfile[key] = secondaryUser.profile[key];
          }
        }

        primaryUserProfile.users.push(secondaryUser);
        await profileService.update(primaryUserProfile.id, {
          data: primaryUserProfile,
        });

        // Delete the profile that was created for the secondary user
        await profileService.delete(secondaryUserProfile.id);

        // Return the primary user's profile and a message saying that the secondary user was added to the primary user
        ctx.send({
          message:
            "Associated " +
            secondaryUser.provider +
            " login with " +
            primaryUserProfile.id,
          profile: primaryUserProfile,
        });
      } catch (err) {
        ctx.send({ message: "Invalid token", error: err });
      }
    },
  })
);
