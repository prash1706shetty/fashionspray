(function validateENVVariables() {
    console.info('Validating env variables...');
    var requiredEnv = ['CLOUDANT_URL'];
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
