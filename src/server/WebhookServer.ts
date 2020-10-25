import express, { json, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { ModVersion } from '../entities/ModVersion';
import { createModuleLogger } from '../logger';
import { Handlers } from '@sentry/node';
import { validateModVersion } from './validation';
import { ValidationError } from 'yup';
import morgan from 'morgan';

const logger = createModuleLogger('WebhookServer');

interface WebhookServerOptions {
  onModVersionRelease(version: ModVersion): void;
}

/**
 * A webhook server serves an http server with the webhook endpoints for this
 * application.
 */
export class WebhookServer {
  private server: Server;
  private options: WebhookServerOptions;

  /**
   * Constructs and starts a webhook http server.
   * @param loggerParent the parent of the logger to use.
   * @param options options for this WebhookServer.
   */
  public constructor(options: WebhookServerOptions) {
    this.options = options;
    const app = express();

    app.use(Handlers.requestHandler());
    app.use(morgan('tiny', {
      stream: {write: (string: string) => logger.http(string)}
    }))
    app.use(json());

    app.post('/webhooks/mod/version', (req: Request, res: Response, next: NextFunction) => this.postModVersion(req, res, next));
    app.use(this.notFound);

    app.use(Handlers.errorHandler());
    app.use(this.error);

    const port = process.env.PORT;
    if (port === undefined) {
      throw new Error('Port (PORT env variable) is not specified!');
    }
    this.server = app.listen(port, () => {
      logger.info(`Listening on port ${port}.`)
    });
  }

  /**
   * Handles POST requests to the `/webhooks/mod/version` endpoint.
   * @param req the http request.
   * @param res the http response.
   * @param next the function to call to forward this request to the next
   * handler.
   */
  private postModVersion(req: Request, res: Response, next: NextFunction): void {
    validateModVersion(req.body)
      .then(this.options.onModVersionRelease)
      .then(() => {
        res.status(200).json({success: true});
      })
      .catch(next);
  }

  /**
   * Express default handler for routes that do not exist.
   * @param req the http request.
   * @param res the http response.
   */
  private notFound(req: Request, res: Response) {
    res.status(404).json({
      error: 'NotFound',
      message: 'The requested resource could not be found!'
    });
  }

  /**
   * Express error handler.
   * @param err the error
   * @param req the http request.
   * @param res the http response.
   * @param next the function to call to forward this request to the next
   * handler.
   */
  private error(err: any, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
      res.status(400).json({
        error: 'SyntaxError',
        message: (err as Error).message,
      });
    } else if (err instanceof ValidationError) {
      res.status(400).json({
        error: 'ValidationError',
        message: err.message,
      });
    } else {
      logger.error(err);
      res.status(500).json({ error: 'Something went wrong on our end!' });
    }
  }

  public shutdown(): void {
    this.server.close();
    logger.info('Shutdown!')
  }
}
