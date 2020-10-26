import { configureDefaultLogger, createModuleLogger } from './logger';
import { config as configDotenv} from 'dotenv';
import { configureSentry } from './sentry';
import { WebhookServer } from './server/WebhookServer';
import { DiscordNotifier } from './notifier/DiscordNotifier';

configDotenv();
configureDefaultLogger();
const logger = createModuleLogger('index');

if (process.env.NODE_ENV !== 'production') {
  logger.warn('WARNING: Running in development mode! Set the NODE_ENV env variable to "production" to turn on production mode!');
}

logger.info('Starting up...');

configureSentry();
new WebhookServer({
  onModVersionRelease(version): void {
    logger.info('on version release', version);
  }
});
new DiscordNotifier();

logger.info('Startup complete!');
