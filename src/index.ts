import logger from './logger';
logger.info('Starting up...')

import { config } from 'dotenv';
config();

import './sentry';
logger.info('Sentry configured.');
