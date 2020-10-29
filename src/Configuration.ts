/**
 * A collection for configurable variables for this application.
 */
export interface Configuration {
  /**
   * The type of environment this application is running in.
   */
  environment: 'development' | 'production';
  /**
   * The client key for the Sentry error reporting service.
   */
  sentryDsn: string;
  /**
   * The port to host the http server on.
   */
  port: number;
  /**
   * The token clients can use to connect to this http server using basic auth.
   * If the token is empty or undefined, the http server will be accessible
   * without authorization.
   */
  token: string | undefined;
  /**
   * Configurable variables for the mod version notifications.
   */
  modVersionNotifications: ModVersionNotificationConfiguration;
  /**
   * Configurable variables for the launcher version notifications.
   */
  launcherVersionNotifications: LauncherVersionNotificationsConfiguration;
}

/**
 * Configurable variables for mod version notifications.
 */
export interface ModVersionNotificationConfiguration {
  /**
   * The discord webhook url to be used for mod version release notifications.
   */
  discordWebhookUrl: string;
}

/**
 * Configurable variables for launcher version notifications.
 */
export interface LauncherVersionNotificationsConfiguration {
  /**
   * The name of the launcher software.
   */
  name: string;
  /**
   * A URL to the download web page of the launcher.
   */
  downloadUrl: string;
  /**
   * Logo image url.
   */
  logoUrl: string;
  /**
   * Discord webhook url to be used for launcher version release notifications.
   */
  discordWebhookUrl: string;
}