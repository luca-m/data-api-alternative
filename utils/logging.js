const winston = require('winston');
const fs = require('fs');
const path = require('path');

const transports = [
  new winston.transports.Console()
];

if (process.env.NODE_ENV !== 'production') {
  const logDir = 'logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  transports.push(
    new winston.transports.File({ filename: path.join(logDir, 'api.log') })
  );
}

/**
 * Logger instance configured with Winston.
 * 
 * This logger is set to log messages at the 'info' level and above.
 * It formats the log messages in JSON format.
 * 
 * Transports:
 * - Console: Logs messages to the console.
 * 
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports
});

module.exports = logger;