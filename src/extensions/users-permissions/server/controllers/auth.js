const strapi_controller = require("@strapi/plugin-users-permissions/server/controllers/auth");
const jwt = require('@strapi/plugin-users-permissions/server/services/jwt');

strapi_controller.verifyToken = async function verifyToken(ctx) {
  const { token } = ctx.request.body;

  try {
    const decoded = await jwt.verify(token);

    //Get the secondary user for the token

    //Get the profile for the secondary user

    //Get the profile for the logged in user

    // Update empty fields on the primary user's profile with values from the secondary user's profile

    // Add the secondary user to the primary user's profile

    // Save the primary user's profile with the secondary user added

    // Delete the profile that was created for the secondary user

    // Return the primary user's profile and a message saying that the secondary user was added to the primary user


  } catch (err) {
    ctx.send({ message: 'Invalid token', error: err });
  }
};

module.exports = {
  ...strapi_controller,
};
