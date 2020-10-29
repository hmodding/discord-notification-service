import { MessageEmbed, Webhook, WebhookClient } from "discord.js";
import { ModVersion } from "../entities/ModVersion";
import { createModuleLogger } from "../logger";
import * as Sentry from '@sentry/node';
import { getModVersionNotifications } from "../environment-configuration";

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

export class DiscordNotifier {
  private webhookClient: WebhookClient;

  public constructor() {
    const webhookUrl = getModVersionNotifications().discordWebhookUrl;
    const idAndToken = decomposeWebhookUrl(webhookUrl);
    this.webhookClient = new WebhookClient(idAndToken.id, idAndToken.token);
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
      await this.webhookClient.send(embed);
      logger.debug(`Sent mod version release notification for mod ${version.modTitle} v${version.version}.`);
    } catch (error) {
      Sentry.captureException(error);
      logger.error(error);
    }
  }
}