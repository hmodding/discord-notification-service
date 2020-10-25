import { configureDefaultLogger, createModuleLogger } from './logger';
import { config as configDotenv} from 'dotenv';
import { configureSentry } from './sentry';

configDotenv();
configureDefaultLogger();
const logger = createModuleLogger('index');

logger.info('Starting up...')
configureSentry();

logger.info('Startup complete!');
