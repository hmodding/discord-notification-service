import { Configuration, LauncherVersionNotificationsConfiguration, ModVersionNotificationConfiguration } from "./configuration";

/**
 * Reads the configuration from environment variables.
 * @throws an error if any configuration value is invalid.
 */
export function getConfiguration(): Configuration {
  return {
    environment: getEnvironment(),
    sentryDsn: getSentryDsn(),
    port: getPort(),
    token: getToken(),
    modVersionNotifications: getModVersionNotifications(),
    launcherVersionNotifications: getLauncherVersionNotifications(),
  }
}

/**
 * Reads the environment type from the NODE_ENV environment variable. Only
 * `production` is considered as a production environment, every other value
 * (including undefined, null, etc.) indicates a development environment.
 */
export function getEnvironment(): 'development' | 'production' {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

/**
 * Reads the Sentry DSN (client key) from the SENTRY_DSN environment variable.
 * @throws an error if the variable is not configured.
 */
export function getSentryDsn(): string {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    throw new Error('Sentry DSN (SENTRY_DSN env variable) is not configured!');
  }
  return dsn;
}

/**
 * Reads the http port for the webhooks server from the `PORT` environment
 * variable.
 * @throws an error if the variable is not configured or not a number
 */
export function getPort(): number {
  const portString = process.env.PORT;
  if (portString === undefined) {
    throw new Error('Port (PORT env variable) is not configured!');
  }

  const port = parseInt(portString, 10);
  if (port === NaN) {
    throw new Error('Port (PORT env variable) is not a number!'); 
  }

  return port;
}

/**
 * Reads the token for the http server from the `TOKEN` environment variable.
 * @throws an error if the token is undefined or empty in production mode.
 */
export function getToken(): string | undefined {
  const token = process.env.TOKEN;
  if (!token && getEnvironment() === 'production') {
    throw new Error('Http token (TOKEN env variable) is not configured! ' +
      'No-auth mode is only allowed in development environments!');
  }

  return token;
}

/**
 * Reads the mod version notification configuration from the `DISCORD_WEBHOOK`
 * environment variable.
 * @throws an error if the discord webhook is not configured.
 */
export function getModVersionNotifications(): ModVersionNotificationConfiguration {
  const discordWebhook = process.env.DISCORD_WEBHOOK;

  if (!discordWebhook) {
    throw new Error('Discord mod version notification webhook (DISCORD_WEBHOOK env variable) is not configured!');
  }

  return {
      discordWebhookUrl: discordWebhook,
  }
}

/**
 * Reads the launcher version notifications configuration from the
 * `LAUNCHER_DISCORD_WEBHOOK`, `LAUNCHER_NAME` and `LAUNCHER_LOGO` environment
 * variables.
 * @throws an error if one of the values is invalid.
 */
export function getLauncherVersionNotifications(): LauncherVersionNotificationsConfiguration {
  const discordWebhookUrl = process.env.LAUNCHER_DISCORD_WEBHOOK;
  const name = process.env.LAUNCHER_NAME;
  const logoUrl = process.env.LAUNCHER_LOGO;
  const downloadUrl = process.env.LAUNCHER_DOWNLOAD;

  if (!discordWebhookUrl) {
    throw new Error('Discord launcher version notification webhook (LAUNCHER_DISCORD_WEBHOOK env variable) is not configured!');
  }
  if (!name) {
    throw new Error('Launcher software name (LAUNCHER_NAME env variable) is not configured!');
  }
  if (!logoUrl) {
    throw new Error('Launcher logo url (LAUNCHER_LOGO env variable) is not configured!');
  }
  if (!downloadUrl) {
    throw new Error('Launcher download url (LAUNCHER_DOWNLOAD env variable) is not configured!');
  }

  return {
    discordWebhookUrl,
    name,
    logoUrl,
    downloadUrl,
  }

}