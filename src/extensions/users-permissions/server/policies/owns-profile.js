module.exports = async (ctx, next) => {
  // If the user is an administrator we allow them to perform this action unrestricted
  // if (ctx.state.user.role.name === "Administrator") {
  //   return next();
  // }

  // Extract the fields regular users should be able to edit
  //const { displayName, user } = ctx.request.body;
  //const { id: currentUserId } = ctx.state.user;

  //Check to see if the existing profile entity's user property matches the value of userToUpdate
  const profile = await strapi.services["plugin::users-permissions.profile"].findOne(
    ctx.params.id,
    { populate: ["user"] }
  );

  if (profile?.user?.id === ctx.state.user.id) {
    strapi.log.info("User owns this profile");
    return true;
  } else {
    strapi.log.error("User does not own this profile");
    return false;
  }

  // // Provide custom validation policy here
  // if (displayName && displayName.trim() === "") {
  //   strapi.log.warn("Display name is required");
  //   return false;
  // }
  // // // Setup the update object
  // // const updateData = { ...ctx.request.body };
  // // // remove properties from the update object that are undefined (not submitted by the user in the PUT request)
  // // Object.keys(updateData).forEach(
  // //   (key) => updateData[key] === undefined && delete updateData[key]
  // // );
  // // if (Object.keys(updateData).length === 0) {
  // //   strapi.log.warn("No data submitted");
  // //   return false;
  // // }
  //
  //return true;
};
