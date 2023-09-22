module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url:  env('SITE_URL', 'https://' + env('HOST', '0.0.0.0')),
  app: {
    keys: env.array("APP_KEYS"),
  },
  cron: {
    enabled: true
  },
  webhooks: {
    // Add this to not receive populated relations in webhooks
    populateRelations: false,
  },
});
