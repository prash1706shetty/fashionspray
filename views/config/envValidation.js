(function validateENVVariables() {
    console.info('Validating env variables...');
    var requiredEnv = ['CLOUDANT_URL', 'SSO_LOGIN_URL', 'HTTPS', 'SSL_CRT_FILE', 'SSL_KEY_FILE', 'BLUE_GROUPS_LIST', 'OIDC_JWT_CERT', 'OIDC_CLIENT_ID', 'OIDC_CLIENT_SECRET', 'OIDC_CALLBACK_URL', 'OIDC_DISCOVERY_URL', 'OIDC_SCOPE', 'OIDC_RESPONSE_TYPE', 'JWT_COOKIE_NAME', 'SESSION_SECRET'];
    var missingCount = requiredEnv.reduce(function (count, name) {
        if (!process.env[name]) {
            console.error('Missing required environment variable : ' + name);
            count++;
        }
        return count;
    }, 0);
    if (missingCount > 0) {
        process.exit(1);
    }
})();
