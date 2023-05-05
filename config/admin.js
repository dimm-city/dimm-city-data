module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'd870fcdf843200794f9b509188fa7207'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'd870fcdf843200794f9b509188fa7207'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
