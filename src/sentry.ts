import { init } from '@sentry/node';
import '@sentry/tracing';
import { getEnvironment, getSentryDsn } from './environment-configuration';
import { createModuleLogger } from './logger';
const logger = createModuleLogger('sentry');

/**
 * Configures Sentry with the SENTRY_DSN environment variable.
 */
export function configureSentry(): void {
  const dsn = getSentryDsn();
  const environment = getEnvironment();

  init({
    dsn,
    tracesSampleRate: 1.0,
    environment,
  });
  logger.info('Sentry configured!');
}
