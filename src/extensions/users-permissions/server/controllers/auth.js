const strapi_controller = require("@strapi/plugin-users-permissions/server/controllers/auth");
const jwt = require('@strapi/plugin-users-permissions/services/jwt');

const _original_callback = strapi_controller.callback;

strapi_controller.callback = async function callback(ctx) {
  const { provider } = ctx.params;

  const { query } = ctx.request;

  // Grab the 'state' value from the query string
  const state = query.state;

  // Execute server code based on the 'state' value
  if (state === "value1") {
    // Execute some server code...
  } else if (state === "value2") {
    // Execute some other server code...
  }

  // Call the original callback function
  await _original_callback(ctx);
};

strapi_controller.verifyToken = async function verifyToken(ctx) {
  const { token } = ctx.request.body;

  try {
    const decoded = await jwt.verify(token);
    ctx.send(decoded);
  } catch (err) {
    ctx.send({ message: 'Invalid token', error: err });
  }
};

module.exports = {
  ...strapi_controller,
};
