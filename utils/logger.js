const winston = require('winston');

// Define the custom settings for each transport (console, file, etc.)
const options = {
    console: {
        level: process.env.NODE_ENV === 'production' ? 'error' : 'debug', // More verbose in development
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.colorize({
                all: false, // Default is false, which means only level and message will be colorized unless specified
                colors: { info: 'blue' } // Colorizing info level messages in blue
            }),
            winston.format.timestamp(),
            winston.format.printf(info => {
                // Apply custom color formatting
                let level = info.level;
                switch (info.level) {
                    case 'info':
                        level = winston.format.colorize().colorize(info.level, info.level);
                        break;
                    default:
                        break;
                }
                return `${info.timestamp} ${level}: ${info.message}`;
            })
        )
    },
    file: {
        level: 'info',
        filename: './logs/app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
};

// Create the logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// Only add console log in non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console(options.console));
}

// Stream for using with middleware that expects a stream, such as morgan
logger.stream = {
    write: function(message) {
        logger.info(message.trim());
    }
};

module.exports = logger;
