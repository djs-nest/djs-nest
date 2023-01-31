import { ManagerShardEventsMap } from '@discordjs/core';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';

export class DjsClient extends AsyncEventEmitter<ManagerShardEventsMap> {}
