import { configureDefaultLogger, createModuleLogger } from './logger';
import { config as configDotenv} from 'dotenv';
import { configureSentry } from './sentry';
import { WebhookServer } from './server/WebhookServer';
import { DiscordNotifier } from './notifier/DiscordNotifier';
import { getConfiguration } from './environment-configuration';

configDotenv();
const config = getConfiguration();

configureDefaultLogger();
const logger = createModuleLogger('index');

if (config.environment === 'development') {
  logger.warn('WARNING: Running in development mode! Set the NODE_ENV env variable to "production" to turn on production mode!');
}

logger.info('Starting up...');

configureSentry();
const notifier = new DiscordNotifier();
new WebhookServer({
  onModVersionRelease: version => notifier.sendModVersionReleaseNotification(version),
  onLauncherVersionRelease: version => notifier.sendLauncherVersionReleaseNotification(version),
  onLoaderVersionRelease: version => notifier.sendLoaderVersionReleaseNotification(version),
});

logger.info('Startup complete!');
