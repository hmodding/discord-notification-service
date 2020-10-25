import { init } from '@sentry/node';
import '@sentry/tracing';
import { createModuleLogger } from './logger';
const logger = createModuleLogger('sentry');

/**
 * Configures Sentry with the SENTRY_DSN environment variable.
 */
export function configureSentry(): void {
  const sentryDsn = process.env.SENTRY_DSN;
  if (!sentryDsn) {   
    throw new Error('Sentry DSN (SENTRY_DSN env variable) is not configured!')
  }
  init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
  logger.info('Sentry configured!');
}
