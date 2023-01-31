import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { DJS_CORE_MODULE_OPTIONS } from '@djs-nest/common';
import { Provider } from '@nestjs/common';
import { DjsCoreModuleOptions } from '../djs-core-options.interface';

export const DjsWsProvider: Provider<WebSocketManager> = {
  provide: WebSocketManager,
  useFactory: (rest: REST, options: DjsCoreModuleOptions) =>
    new WebSocketManager({ rest, token: options.token, intents: options.intents, ...options.ws }),
  inject: [REST, DJS_CORE_MODULE_OPTIONS]
};
