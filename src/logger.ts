import {
  transports, format, configure, Logger, child
} from 'winston';
import { getEnvironment } from './environment-configuration';

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
 * The length that module names will be padded / cut to.
 */
export const paddedModuleLength = 16;

/**
 * Pads / cuts a module name to the `paddedModuleLength`. 
 * @param module the module name to pad.
 * @remarks It is recommended to store the padded module name somewhere.
 */
function padModule(module: string): string {
  if (module.length >= paddedModuleLength) {
    return module.substr(0, paddedModuleLength)
  } else {
    return module + ' '.repeat(paddedModuleLength - module.length);
  }
}

/**
 * Configures the default logger that is available through the winston module
 * itself.
 */
export function configureDefaultLogger(): void {
  const environment = getEnvironment();
  
  // in production, log only info and below
  const defaultLevel = environment === 'production' ? 'info' : 'debug';

  const modulePaddingMap = new Map<string, string>();

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
      environment,
    },
    transports: [
      new transports.File({ filename: 'error.log', level: 'error' }),
      new transports.File({ filename: 'combined.log' }),
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf((info) => {
            let module = modulePaddingMap.get(info.module);
            if (module === undefined) {
              module = padModule(info.module);
              modulePaddingMap.set(info.module, module);
            }

            let string = `${info.timestamp} [${module}] ${info.level}: ${info.stack !== undefined ? info.stack : info.message.trim()}`;
            return string;
          })
        ),
      }),
    ],
  });
}
