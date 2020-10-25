import { createModuleLogger } from './logger';
const logger = createModuleLogger('sentry');

const sentryDsn = process.env.SENTRY_DSN;
if (!sentryDsn) {   
  throw new Error('Sentry DSN (SENTRY_DSN env variable) is not configured!')
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
