import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { verifyKey } from './utils/key.util';

@Injectable()
export class InteractionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(InteractionMiddleware.name);

  constructor(private readonly publicKey: Uint8Array | ArrayBuffer | Buffer | string) {}

  use(req: Request, res: Response, next: () => void) {
    const timestamp = (req.header('x-signature-timestamp') || '') as string;
    const signature = (req.header('x-signature-ed25519') || '') as string;

    const onBodyComplete = (rawBody: Buffer) => {
      if (!verifyKey(rawBody, signature, timestamp, this.publicKey)) {
        res.statusCode = 401;
        res.end('[discord-interactions]: Invalid signature');
        return;
      }

      const body = JSON.parse(rawBody.toString('utf-8')) || {};
      if (body.type === 1) {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            type: 1
          })
        );
        return;
      }

      req.body = body;
      next();
    };

    if (req.body) {
      if (Buffer.isBuffer(req.body)) {
        onBodyComplete(req.body);
      } else if (typeof req.body === 'string') {
        onBodyComplete(Buffer.from(req.body, 'utf-8'));
      } else {
        this.logger.warn(
          '[discord-interactions]: req.body was tampered with, probably by some other middleware. Disabling middleware for interaction routes so that req.body is a raw buffer.'
        );
        // Attempt to reconstruct the raw buffer. This works but is risky
        // because it depends on JSON.stringify matching the Discord backend's
        // JSON serialization.
        onBodyComplete(Buffer.from(JSON.stringify(req.body), 'utf-8'));
      }
    } else {
      const chunks: Array<Buffer> = [];
      req.on('data', chunk => {
        chunks.push(chunk);
      });
      req.on('end', () => {
        const rawBody = Buffer.concat(chunks);
        onBodyComplete(rawBody);
      });
    }
  }
}
