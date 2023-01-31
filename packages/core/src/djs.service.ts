import { createClient } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { DjsClient } from './client';

@Injectable()
export class DjsService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(DjsService.name);

  private readonly _client: DjsClient;

  constructor(rest: REST, private ws: WebSocketManager) {
    this._client = createClient({ rest, ws });
    this.ws.on(WebSocketShardEvents.Closed, ({ code }) => {
      this.logger.log(`WebSocket Closed with ${code} code`);
    });
    this.ws.on(WebSocketShardEvents.Resumed, () => {
      this.logger.log('WebSocket Resumed');
    });
  }

  get client(): DjsClient {
    return this._client;
  }

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.ws.connect();
    } catch (error) {
      this.logger.error('Failed to connect websocket', error);
    }
  }

  onApplicationShutdown(): void {
    this.ws.destroy();
  }
}
