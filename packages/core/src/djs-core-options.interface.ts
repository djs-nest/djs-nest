import { GatewayIntentBits } from '@discordjs/core';
import { OptionalWebSocketManagerOptions } from '@discordjs/ws';
import { DjsRestModuleOptions } from '@djs-nest/rest';

export interface DjsCoreModuleOptions extends DjsRestModuleOptions {
  token: string;
  intents: GatewayIntentBits;
  ws?: Partial<OptionalWebSocketManagerOptions>;
}
