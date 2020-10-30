import { MessageEmbed, Webhook, WebhookClient } from "discord.js";
import { ModVersion } from "../entities/ModVersion";
import { createModuleLogger } from "../logger";
import * as Sentry from '@sentry/node';
import { LauncherVersion } from "../entities/LauncherVersion";
import {
  getLauncherVersionNotifications, getLoaderVersionNotifications,
  getModVersionNotifications
} from "../environment-configuration";
import { LauncherVersionNotificationsConfiguration,
  LoaderVersionNotificationsConfiguration, ModVersionNotificationConfiguration
} from "../Configuration";
import { LoaderVersion } from "../entities/LoaderVersion";

const logger = createModuleLogger('DiscordNotifier');

/**
 * This regular expression matches Discord webhook URLs where the first
 * capturing group is the webhook ID and the second capturing group is the
 * webhook token.
 */
const discordWebhookUrlRegex = /https:\/\/discord\.com\/api\/webhooks\/(\d+)\/([^\s]+)/;

/**
 * Extracts the webhook ID and token from a webhook URL.
 * @param url the webhook URL to decompose.
 */
export function decomposeWebhookUrl(url: string) {
    const regexResult = discordWebhookUrlRegex.exec(url);

    if (regexResult === null) {
        throw new SyntaxError('The provided url is not a webhook!');
    }

    return {
      id: regexResult[1],
      token: regexResult[2],
    }
}

/**
 * Creates a new webhook client for a given webhook URL.
 * @param url the discord webhook URL.
 */
function createWebhookClientForUrl(url: string) {
  const idAndToken = decomposeWebhookUrl(url);
  return new WebhookClient(idAndToken.id, idAndToken.token);
}

export class DiscordNotifier {
  private modConfig: ModVersionNotificationConfiguration;
  private launcherConfig: LauncherVersionNotificationsConfiguration;
  private loaderConfig: LoaderVersionNotificationsConfiguration;
  private modVersionWebhookClient: WebhookClient;
  private launcherVersionWebhookClient: WebhookClient;
  private loaderVersionWebhookClient: WebhookClient;

  public constructor() {
    this.modConfig = getModVersionNotifications();
    const modUrl = this.modConfig.discordWebhookUrl;
    this.modVersionWebhookClient = createWebhookClientForUrl(modUrl);

    this.launcherConfig = getLauncherVersionNotifications();
    const launcherUrl = this.launcherConfig.discordWebhookUrl;
    this.launcherVersionWebhookClient = createWebhookClientForUrl(launcherUrl);

    this.loaderConfig = getLoaderVersionNotifications();
    const loaderUrl = this.loaderConfig.discordWebhookUrl;
    this.loaderVersionWebhookClient = createWebhookClientForUrl(loaderUrl);

    logger.info('Discord Notifier started!');
  }

  /**
   * Sends a mod version release notification to Discord.
   * @param version the released mod version.
   * @remarks DiscordAPIErrors will be logged but not thrown.
   */
  public async sendModVersionReleaseNotification(version: ModVersion): Promise<void> {
    const embed = new MessageEmbed()
      .setTitle(version.modTitle)
      .setURL(version.modUrl)
      .setDescription(version.modDescription)
      .addField('Author', `[${version.modAuthorName}](${version.modAuthorUrl})`, true)
      .addField('Version', version.version, true)
      .addField('Changelog', version.changelog, false)
      .setThumbnail(version.modIconUrl);

    if (version.initial) {
      embed.setImage(version.modBannerUrl);
    }

    try {
      await this.modVersionWebhookClient.send(embed);
      logger.debug(`Sent mod version release notification for mod ${version.modTitle} v${version.version}.`);
    } catch (error) {
      Sentry.captureException(error);
      logger.error(error);
    }
  }

  /**
   * Sends a launcher version release notification to Discord.
   * @param version the released launcher version.
   * @remarks DiscordAPIErrors will be logged but not thrown.
   */
  public async sendLauncherVersionReleaseNotification(version: LauncherVersion): Promise<void> {
    const embed = new MessageEmbed()
      .setTitle(this.launcherConfig.name)
      .setURL(this.launcherConfig.downloadUrl)
      .addField('Version', `[${version.version}](${version.url})`, true)
      .addField('Changelog', version.changelog, false)
      .setThumbnail(this.launcherConfig.logoUrl);

    try {
      await this.launcherVersionWebhookClient.send(embed);
      logger.debug(`Sent launcher version release notification for launcher v${version.version}.`);
    } catch (error) {
      Sentry.captureException(error);
      logger.error(error);
    }
  }

  /**
   * Sends a mod loader version release notification to Discord.
   * @param version the released mod loader version.
   * @remarks DiscordAPIErrors will be logged but not thrown.
   */
  public async sendLoaderVersionReleaseNotification(version: LoaderVersion): Promise<void> {
    const embed = new MessageEmbed()
      .setTitle(this.loaderConfig.name)
      .addField('Mod Loader Version', `[${version.version}](${version.url})`, true)
      .addField('Game Version', version.gameVersion , true)
      .addField('Changelog', version.changelog, false)
      .setThumbnail(this.loaderConfig.logoUrl);

    try {
      await this.loaderVersionWebhookClient.send(embed);
      logger.debug(`Sent mod loader version release notification for launcher v${version.version}.`);
    } catch (error) {
      Sentry.captureException(error);
      logger.error(error);
    }
  }
}