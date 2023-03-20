const { format, createLogger, transports } = require("winston");


const logger = createLogger({

  transports: [
    new transports.File({
      filename: "logs/logs.log",
      level: 'info',
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.File({
      level: "error",
      filename: "logs/error.log",
      format: format.combine(format.timestamp(), format.json())
    }),
    new transports.Console(),
  ],
});

module.exports = logger;