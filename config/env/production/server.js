module.exports = ({ env }) => ({
    port: env.int('PORT', 8080),
    url:  env('SITE_URL', 'https://dimm-city-data-v2.azurewebsites.net'), // 'https://data.dimm.city'),
    production: true,
    proxy: {
        enabled: false
    },
    cron: {
        enabled: false
    },
    admin: {
        autoOpen: false,
        auth: {
            secret: "${process.env.ADMIN_JWT_SECRET} || 9518cfb7-49bb-4e6d-a518-b8de90c015a0"
        }
    }
});
