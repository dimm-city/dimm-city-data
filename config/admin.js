module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'd870fcdf843200794f9b509188fa7207'),
  },
});
