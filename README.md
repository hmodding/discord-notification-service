# Discord Notification Service
This project is a microservice that sends notifications to discord webhooks.
Notifications are triggered by webhooks to this project itself.

# Development Setup
You'll need to have Node.js v12 or higher as well as `npm`.

1. Install dependencies: `npm install`
2. [Configure](#Configuration) the application.
3. Run in development mode `npm run dev`

# Configuration
You'll need to define the following environment variables. Use a `.env` file in
development environments.

| Variable Name | Description |
| --- | --- |
| `NODE_ENV` | Use `production` for production environments and anything else for development environments. |
| `PORT` | The port to use for the http API server. |
| `TOKEN` | The token/password to use for http authorization to this application. Can be left out in development environments to omit authorization. |
| `SENTRY_DSN` | Client key for sentry monitoring. |
| `DISCORD_WEBHOOK` | The Discord webhook URL to push mod version update notifications to. |
| `MOD_DISCORD_ROLE` | The id of the Discord role to ping in mod version update notifications. Can be left out to disable pings. |
| `LAUNCHER_NAME` | The name of the launcher software. |
| `LAUNCHER_DOWNLOAD` | The URL where you can download the launcher. |
| `LAUNCHER_LOGO` | The URL to a logo image of the launcher. |
| `LAUNCHER_DISCORD_WEBHOOK` | The Discord webhook URL to push launcher version updates to. |
| `LAUNCHER_DISCORD_ROLE` | The id of the Discord role to ping in launcher version update notifications. Can be left out to disable pings. |
| `LOADER_NAME` | The name of the mod loader software. |
| `LOADER_LOGO` | The URL to a logo image of the mod loader. |
| `LOADER_DISCORD_WEBHOOK` | The Discord webhook URL to push mod loader version update notifications to. |
| `LOADER_DISCORD_ROLE` | The id of the Discord role to ping in mod loader version update notifications. Can be left out to disable pings. |
| `PING_COOLDOWN` | The minimum waiting time between pinging the same role again (in milliseconds). |

# License
This project is made available to you by [traxam](https://trax.am) via the [MIT License](./LICENSE).