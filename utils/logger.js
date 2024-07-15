const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configure the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

module.exports = logger;
