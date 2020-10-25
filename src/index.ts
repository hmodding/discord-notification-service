import { configureDefaultLogger, createModuleLogger } from './logger';
import { config as configDotenv} from 'dotenv';
import { configureSentry } from './sentry';
import { WebhookServer } from './server/WebhookServer';

configDotenv();
configureDefaultLogger();
const logger = createModuleLogger('index');

logger.info('Starting up...')
configureSentry();
new WebhookServer({
  onModVersionRelease(version): void {
    logger.info('on version release', version);
  }
});

logger.info('Startup complete!');
