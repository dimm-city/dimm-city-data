module.exports = async (ctx, next) => {
  //Get the profile for the logged in user
  const primaryUserProfile = await strapi.db
    .query("plugin::users-permissions.profile")
    .findOne({
      where: { users: ctx.state.user.id },
      populate: { users: true },
    });

  if (primaryUserProfile && primaryUserProfile.id == ctx.params.id) {
    strapi.log.debug("User owns this profile");
    return true;
  }

  strapi.log.error("User does not own this profile");
  return false;
};
