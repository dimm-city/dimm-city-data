module.exports = ({ env }) => ({
  port: env.int("PORT", 8080),
  frontEndUrl: "https://dimm.city",
  production: true,
  proxy: {
    enabled: false,
  },
  cron: {
    enabled: env("ENABLE_CRON") || true,
  },
  admin: {
    autoOpen: false,
    auth: {
      secret:
        "${process.env.ADMIN_JWT_SECRET} || 9518cfb7-49bb-4e6d-a518-b8de90c015a0",
    },
  },
});
