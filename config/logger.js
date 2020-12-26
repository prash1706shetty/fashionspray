const { transports, createLogger, format } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'activity.log', level: 'info' })
    ]
});

const schedulerLogger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'schedulerError.log', level: 'error' }),
        new transports.File({ filename: 'schedulerActivity.log', level: 'info' })
    ]
});

module.exports.logger = logger;
module.exports.schedulerLogger = schedulerLogger;