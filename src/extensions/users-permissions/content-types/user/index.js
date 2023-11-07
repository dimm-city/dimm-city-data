//https://forum.strapi.io/t/strapi-create-new-user-users-permissions-plugin-lifecycles/13386/5
const schema = require("./schema.json");

module.exports = {
  schema,
  lifecycles: {
    async afterCreate(event) {
      const { result } = event;
      try {
        const profileService = strapi.service(
          "plugin::users-permissions.profile"
        );

        const profile = await profileService.create({
          data: {
            displayName: result.username,
            email: result.email,
            users: [result],
          },
        });

        result.profile = profile;

      } catch (error) {
        console.log(error);
      }
    },
    async afterFindOne(event) {
      try {
        const { result } = event;
        const profileService = strapi.service(
          "plugin::users-permissions.profile"
        );
        const profiles = await profileService.find({
          filters: { users: result },
        });
        let profile = {};

        if (profiles.results.length === 0) {
          profile = await profileService.create({
            data: {
              displayName: result.username,
              email: result.email,
              users: [result],
            },
          });
        } else {
          profile = profiles.results[0];
        }

        result.profile = profile;
      } catch (error) {
        strapi.log.error("Could not load profile", error);
      }
    },
  },
};
