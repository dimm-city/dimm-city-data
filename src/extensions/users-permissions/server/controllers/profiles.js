async function associateLogin(ctx) {
  const { token: secondary_token } = ctx.request.body;

  try {
    const decoded = await jwt.verify(secondary_token);

    //Get the secondary user for the token
    const secondaryUser = await strapi
      .query("user", "users-permissions")
      .findOne({ id: decoded.id });

    //Get the profile for the secondary user
    const secondaryUserProfile = await strapi
      .query("profile")
      .findOne({ user: secondaryUser.id });

    //Get the profile for the logged in user
    const primaryUserProfile = await strapi
      .query("profile")
      .findOne({ user: ctx.state.user.id });

    // Update empty fields on the primary user's profile with values from the secondary user's profile
    for (let key in primaryUserProfile) {
      if (!primaryUserProfile[key]) {
        primaryUserProfile[key] = secondaryUserProfile[key];
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
}


module.exports = {
  associateLogin,
};
