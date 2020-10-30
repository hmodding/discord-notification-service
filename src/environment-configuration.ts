import {
  Configuration, LauncherVersionNotificationsConfiguration,
  LoaderVersionNotificationsConfiguration, ModVersionNotificationConfiguration
} from "./Configuration";

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
    loaderVersionNotifications: getLoaderVersionNotifications(),
    pingCooldown: getPingCooldown(),
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
 * Reads the ping cooldown from the `PING_COOLDOWN` environment variable.
 * @throws an error if the ping cooldown is not a number.
 */
export function getPingCooldown(): number {
  const cooldownString = process.env.PING_COOLDOWN;
  if (cooldownString === undefined) {
    throw new Error('Ping cooldown (PING_COOLDOWN env variable) is not configured!');
  }

  const cooldown = parseInt(cooldownString, 10);
  if (cooldown === NaN) {
    throw new Error('Ping cooldown (PING_COOLDOWN env variable) is not a number!'); 
  }

  return cooldown;
}

/**
 * Reads the mod version notification configuration from the `DISCORD_WEBHOOK`
 * and `MOD_DISCORD_ROLE` environment variables.
 * @throws an error if the discord webhook is not configured.
 */
export function getModVersionNotifications(): ModVersionNotificationConfiguration {
  const discordWebhook = process.env.DISCORD_WEBHOOK;

  if (!discordWebhook) {
    throw new Error('Discord mod version notification webhook (DISCORD_WEBHOOK env variable) is not configured!');
  }

  return {
      discordWebhookUrl: discordWebhook,
      discordRolePingId: validateDiscordRoleId('MOD_DISCORD_ROLE'),
  }
}

/**
 * Reads the launcher version notifications configuration from the
 * `LAUNCHER_DISCORD_WEBHOOK`, `LAUNCHER_NAME`, `LAUNCHER_LOGO` and `LAUNCHER_DISCORD_ROLE` environment
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
    discordRolePingId: validateDiscordRoleId('LAUNCHER_DISCORD_ROLE'),
  }
}

/**
 * Reads the mod loader version notifications configuration from the
 * `LOADER_DISCORD_WEBHOOK`, `LOADER_NAME`, `LOADER_LOGO` and
 * `LOADER_DISCORD_ROLE` environment variables.
 * @throws an error if one of the values is invalid.
 */
export function getLoaderVersionNotifications(): LoaderVersionNotificationsConfiguration {
  const discordWebhookUrl = process.env.LOADER_DISCORD_WEBHOOK;
  const name = process.env.LOADER_NAME;
  const logoUrl = process.env.LOADER_LOGO;

  if (!discordWebhookUrl) {
    throw new Error('Discord mod loader version notification webhook (LOADER_DISCORD_WEBHOOK env variable) is not configured!');
  }
  if (!name) {
    throw new Error('Mod loader software name (LOADER_NAME env variable) is not configured!');
  }
  if (!logoUrl) {
    throw new Error('Mod loader logo url (LOADER_LOGO env variable) is not configured!');
  }
  
  return {
    discordWebhookUrl,
    name,
    logoUrl,
    discordRolePingId: validateDiscordRoleId('LOADER_DISCORD_ROLE'),
  }
}

/**
 * Gets a role id from an environment variable and validates it.
 * @param envKey the name of the environment variable.
 */
function validateDiscordRoleId(envKey: string): string | undefined {
  const id = process.env[envKey];
  if (id !== undefined && !/^\d*$/.test(id)) {
    throw new Error(`Role id '${id}' (${envKey} env variable) is invalid!`);
  }
  return id;
}
