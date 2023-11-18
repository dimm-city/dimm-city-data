module.exports = ({ env }) => ({
    port: env.int('PORT', 8080),
    host: "0.0.0.0",
    url: 'http://localhost:1337',
    production: false,
    frontEndUrl: 'http://localhost:5137',
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
