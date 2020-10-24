import {
  createLogger, Logger, transports, format,
} from 'winston';


const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: {
    service: 'discord-notifications',
  },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console({
      format: format.combine(
        format.simple(),
        format.colorize(),
      ),
    }),
  ],
});

export default logger;
