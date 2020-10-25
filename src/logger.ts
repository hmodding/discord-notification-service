import {
  transports, format, configure, Logger, child
} from 'winston';

/**
 * Creates a logger for a module with a given name.
 * @param module the name of the module this logger is for.
 */
export function createModuleLogger(module: string): Logger {
  return child({
    module
  });
}

/**
 * Configures the default logger that is available through the winston module
 * itself.
 */
export function configureDefaultLogger(): void {
  const nodeEnv = process.env.NODE_ENV;
  // in production, log only info and below
  const defaultLevel = nodeEnv !== 'production' ? 'debug' : 'info';

  configure({
    level: defaultLevel,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
      format.align()
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
}
