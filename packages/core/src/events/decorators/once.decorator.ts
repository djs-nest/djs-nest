import { MappedEvents } from '@discordjs/core';
import { Listener } from './listener.decorator';

export const Once = <K extends keyof MappedEvents>(event: K) => Listener({ type: 'once', event });
