import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

const sentryDsn = process.env.SENTRY_DSN;
if (!sentryDsn) {   
  throw new Error('Sentry DSN (SENTRY_DSN env variable) is not configured!')
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
