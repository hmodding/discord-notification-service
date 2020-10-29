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
development environments only!

| Variable Name | Description |
| --- | --- |
| `NODE_ENV` | Use `production` for production environments and anything else for development environments. |
| `PORT` | The port to use for the http API server. |
| `SENTRY_DSN` | Client key for sentry monitoring. |
| `DISCORD_WEBHOOK` | The Discord webhook to push notifications to. |
| `TOKEN` | The token/password to use for http authorization to this application. Can be left out in development environments to omit authorization. |

# License
This project is made available to you by @traxam via the [MIT License](./LICENSE).