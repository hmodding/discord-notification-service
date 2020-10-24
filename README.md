# Discord Notification Service
This project is a microservice that sends notifications to discord webhooks.
Notifications are triggered by webhooks to this project itself.

# Development Setup
You'll need to have Node.js v10 or higher as well as `npm`.

1. Install dependencies: `npm install`
2. Obtain a [Sentry](https://sentry.io) DSN code and put it in a `.env` file in the root of this directory like this: `SENTRY_DSN=<your-dsn-url>`
3. Run in development mode `npm run dev`

# License
This project is made available to you by @traxam via the [MIT License](./LICENSE).