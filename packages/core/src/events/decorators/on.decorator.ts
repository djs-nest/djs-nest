import { MappedEvents } from '@discordjs/core';
import { Listener } from './listener.decorator';

export const On = <K extends keyof MappedEvents>(event: K) => Listener({ type: 'on', event });
