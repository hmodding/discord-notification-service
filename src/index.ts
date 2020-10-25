import { configureDefaultLogger, createModuleLogger } from './logger';
import { config as configDotenv} from 'dotenv';

configDotenv();
configureDefaultLogger();
const logger = createModuleLogger('index');

logger.info('Starting up...')

import { config } from 'dotenv';
config();

logger.info('Startup complete!');
